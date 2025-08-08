import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserWithPermissions,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { Session } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { AppPermission } from './constants/app-permissions';
import {
  AuthenticatedUser,
  RequestWithUser,
} from 'src/shared/types/context.types';
import { ExtractJwt } from 'passport-jwt';
import { createId } from '@paralleldrive/cuid2';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from 'src/shared/constants/pagination.constants';

interface AccessTokenPayload {
  sub: string;
  sessionId: string;
  permissions: AppPermission[];
  jti?: string; // << THÊM DÒNG NÀY: jti là JWT ID, tùy chọn
}

export interface PaginatedSessions {
  nodes: Session[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithPermissions | null> {
    // SỬA LẠI: Sử dụng findWithPermissionsByEmail để có đầy đủ dữ liệu
    const user = await this.userRepository.findWithPermissionsByEmail(email);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // `user` đã là một instance UserAggregate với permissions, chỉ cần trả về nó
      return user;
    }
    return null;
  }

  async login(
    user: UserWithPermissions,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // 1. **Tạo Refresh Token và các thông tin liên quan**
    const refreshTokenPayload = { sub: user.id };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_SECRET_EXPIRES_IN',
        '7d',
      ),
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    // 2. **Tạo Access Token ID (jti)**
    const accessTokenId = createId();

    // 3. **Tạo bản ghi Session**
    //    Chúng ta lưu jti của access token đầu tiên ngay lúc tạo session
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        hashedRefreshToken,
        ipAddress,
        userAgent,
        expiresAt: refreshTokenExpiresAt,
        lastAccessTokenId: accessTokenId, // << Gán jti ngay lúc tạo
      },
    });

    // 4. **Tạo Access Token một lần duy nhất**
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      sessionId: session.id, // << Lấy sessionId từ session vừa tạo
      permissions: user.permissions,
      jti: accessTokenId,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN', '15m'),
    });

    // 5. **Trả về kết quả**
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const userSessions = await this.prisma.session.findMany({
      where: { userId: userId, revokedAt: null },
    });
    if (!userSessions || userSessions.length === 0) {
      throw new UnauthorizedException('No active sessions found.');
    }

    let validSession: Session | null = null;
    for (const session of userSessions) {
      if (
        session.hashedRefreshToken &&
        (await bcrypt.compare(refreshToken, session.hashedRefreshToken))
      ) {
        validSession = session;
        break;
      }
    }
    if (!validSession || validSession.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Refresh token is invalid or has expired.',
      );
    }

    const user = await this.userRepository.findWithPermissionsById(
      validSession.userId,
    );
    if (!user) {
      throw new UnauthorizedException('User for this session not found.');
    }

    // --- SỬA LẠI LOGIC TẠO VÀ CẬP NHẬT JTI ---
    const accessTokenId = createId();
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      sessionId: validSession.id,
      permissions: user.permissions,
      jti: accessTokenId,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN', '15m'),
    });

    // **CẬP NHẬT JTI MỚI VÀO DATABASE**
    await this.prisma.session.update({
      where: { id: validSession.id },
      data: { lastAccessTokenId: accessTokenId },
    });

    return { access_token: accessToken };
  }

  async logout(sessionId: string): Promise<boolean> {
    // Dùng `update` để đánh dấu là đã bị thu hồi, thay vì `delete`
    await this.prisma.session.updateMany({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
      },
    });
    return true; // Trả về true nếu xóa thành công
  }

  // Logout tất cả các session của một user
  async logoutAll(userId: string): Promise<boolean> {
    // Dùng `updateMany` để thu hồi tất cả session của user
    await this.prisma.session.updateMany({
      where: {
        userId: userId,
        revokedAt: null, // Chỉ thu hồi những session đang hoạt động
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return true;
  }

  async getActiveSessions(
    userId: string,
    args: PaginationArgs,
  ): Promise<PaginatedSessions> {
    const page = args.page ?? DEFAULT_PAGE;
    const limit = args.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const [sessions, totalCount] = await this.prisma.$transaction([
      this.prisma.session.findMany({
        where: {
          userId: userId,
          expiresAt: { gt: new Date() },
          revokedAt: null,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.session.count({
        where: {
          userId: userId,
          expiresAt: { gt: new Date() },
          revokedAt: null,
        },
      }),
    ]);

    return {
      nodes: sessions,
      meta: { totalCount, page, limit },
    };
  }

  async validateAndGetUserFromToken(
    req: RequestWithUser,
  ): Promise<AuthenticatedUser | null> {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) return null;

      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const session = await this.prisma.session.findFirst({
        where: { id: payload.sessionId, revokedAt: null },
      });

      // SỬA LẠI: Đơn giản hóa điều kiện kiểm tra
      if (
        !session ||
        session.expiresAt < new Date() ||
        session.lastAccessTokenId !== payload.jti
      ) {
        return null;
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) return null;

      const authenticatedUser = user as AuthenticatedUser;
      authenticatedUser.permissions = payload.permissions;
      authenticatedUser.sessionId = payload.sessionId;
      return authenticatedUser;
    } catch (error: unknown) {
      // << Sửa lại: Bỏ `_` và định kiểu là `unknown`

      // 1. Khai báo một thông điệp lỗi mặc định
      let errorMessage =
        'An unexpected error occurred during token validation.';

      // 2. Sử dụng type guard để kiểm tra kiểu của `error`
      if (error instanceof Error) {
        // Nếu `error` là một instance của `Error`, chúng ta có thể truy cập `.message` an toàn
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // Xử lý trường hợp ai đó `throw 'some string'`
        errorMessage = error;
      }

      // 3. Ghi log với thông điệp đã được xử lý
      console.error(`Token validation failed: ${errorMessage}`);

      // Bạn cũng có thể log toàn bộ đối tượng lỗi để xem chi tiết nếu cần
      // console.error('Full validation error object:', error);

      return null;
    }
  }
}
