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

interface AccessTokenPayload {
  sub: string;
  sessionId: string;
  permissions: AppPermission[];
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
    const user = await this.userRepository.findWithPermissionsByEmail(email);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result as UserWithPermissions;
    }
    return null;
  }

  async login(
    user: UserWithPermissions,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // 1. **Tạo Payload cho Access Token (chưa cần sign)**
    const accessTokenPayload = {
      sub: user.id,
      sessionId: '',
      permissions: user.permissions,
    };

    // SỬA LỖI: Biến `accessToken` không cần thiết ở đây, chúng ta sẽ tạo nó ở cuối

    // 2. **Tạo Refresh Token (JWT)**
    const refreshTokenPayload = { sub: user.id };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_SECRET_EXPIRES_IN',
        '7d',
      ),
    });

    // 3. **Hash Refresh Token**
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // 4. **Tính toán thời gian hết hạn**
    const refreshTokenExpiresAt = new Date();
    const expiresInDays = parseInt(
      this.configService.get<string>('JWT_REFRESH_SECRET_EXPIRES_IN', '7d'),
      10,
    );
    refreshTokenExpiresAt.setDate(
      refreshTokenExpiresAt.getDate() + expiresInDays,
    );

    // 5. **Tạo bản ghi Session**
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        hashedRefreshToken: hashedRefreshToken,
        ipAddress: ipAddress,
        userAgent: userAgent,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // 6. **Cập nhật Access Token với sessionId và Sign nó**
    const finalAccessTokenPayload = {
      ...accessTokenPayload,
      sessionId: session.id,
    };
    const finalAccessToken = this.jwtService.sign(finalAccessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN', '15m'),
    });

    // 7. **Trả về kết quả**
    return {
      access_token: finalAccessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    // 1. Tìm tất cả các session của user
    const userSessions = await this.prisma.session.findMany({
      where: {
        userId: userId,
        revokedAt: null, // << THÊM ĐIỀU KIỆN
      },
    });

    if (!userSessions || userSessions.length === 0) {
      throw new UnauthorizedException('No active sessions found.');
    }

    // 2. Tìm session khớp với refresh token
    // Khai báo kiểu rõ ràng cho validSession
    let validSession: Session | null = null;
    for (const session of userSessions) {
      // Chỉ so sánh nếu hashedRefreshToken tồn tại
      if (
        session.hashedRefreshToken &&
        (await bcrypt.compare(refreshToken, session.hashedRefreshToken))
      ) {
        validSession = session;
        break;
      }
    }

    // `validSession` giờ đây có kiểu `Session | null`
    if (!validSession || validSession.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Refresh token is invalid or has expired.',
      );
    }

    // 3. Tải lại user với permissions đầy đủ
    const user = await this.userRepository.findWithPermissionsById(
      validSession.userId,
    );
    if (!user) {
      // Trường hợp hiếm gặp: session tồn tại nhưng user đã bị xóa
      throw new UnauthorizedException('User for this session not found.');
    }

    // 4. Tạo access token mới
    const accessTokenPayload = {
      sub: user.id,
      sessionId: validSession.id,
      permissions: user.permissions,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload);

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

  async getActiveSessions(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date(), // Chỉ lấy các session chưa hết hạn
        },
        revokedAt: null, // << THÊM ĐIỀU KIỆN
      },
      orderBy: {
        createdAt: 'desc', // Sắp xếp theo phiên mới nhất
      },
    });
  }

  async validateAndGetUserFromToken(
    req: RequestWithUser,
  ): Promise<AuthenticatedUser | null> {
    try {
      // Logic bên trong không thay đổi.
      // `ExtractJwt` vẫn hoạt động tốt vì `RequestWithUser` kế thừa từ `Request` của Express.
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!token) {
        return null;
      }

      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Sửa lại query session để kiểm tra cả `revokedAt`
      const session = await this.prisma.session.findFirst({
        where: {
          id: payload.sessionId,
          revokedAt: null, // << THÊM ĐIỀU KIỆN
        },
      });
      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        return null;
      }

      const authenticatedUser = user as AuthenticatedUser;
      authenticatedUser.permissions = payload.permissions;
      authenticatedUser.sessionId = payload.sessionId;

      return authenticatedUser;
    } catch (error) {
      console.error('Error validating token:', error);
      return null;
    }
  }
}
