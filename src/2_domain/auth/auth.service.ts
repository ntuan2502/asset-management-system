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
import { AUTH_ERRORS } from 'src/shared/constants/error-messages.constants';
import { RefreshTokenPayload } from './types/jwt-payload.types';

interface AccessTokenPayload {
  sub: string;
  sessionId: string;
  permissions: AppPermission[];
  jti?: string;
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
    const user = await this.userRepository.findWithPermissionsByEmail(email);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(
    user: UserWithPermissions,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // 1. **Tạo bản ghi Session TẠM THỜI**
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    // Tạo session trước để lấy ID
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt: refreshTokenExpiresAt,
        // hashedRefreshToken và lastAccessTokenId sẽ được cập nhật sau
      },
    });

    // 2. **Tạo Refresh Token DUY NHẤT**
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      sessionId: session.id,
    }; // << THÊM sessionId
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_SECRET_EXPIRES_IN',
      ),
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // 3. **Tạo Access Token**
    const accessTokenId = createId();
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      sessionId: session.id,
      permissions: user.permissions,
      jti: accessTokenId,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN'),
    });

    // 4. **Cập nhật lại Session với các token đã tạo**
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        hashedRefreshToken,
        lastAccessTokenId: accessTokenId,
      },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(userId: string, refreshToken: string, sessionId: string) {
    // 1. **Query trực tiếp vào session cụ thể**
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    // 2. **Xác thực session**
    if (
      !session ||
      session.userId !== userId || // Đảm bảo session này thuộc về đúng user
      session.revokedAt ||
      !session.hashedRefreshToken ||
      !(await bcrypt.compare(refreshToken, session.hashedRefreshToken)) ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedException(
        AUTH_ERRORS.REFRESH_TOKEN_INVALID_OR_EXPIRED,
      );
    }

    const user = await this.userRepository.findWithPermissionsById(
      session.userId,
    );
    if (!user) {
      throw new UnauthorizedException(AUTH_ERRORS.USER_FOR_SESSION_NOT_FOUND);
    }

    const accessTokenId = createId();
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      sessionId: session.id,
      permissions: user.permissions,
      jti: accessTokenId,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN'),
    });

    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastAccessTokenId: accessTokenId },
    });

    return { access_token: accessToken };
  }

  async logout(sessionId: string): Promise<boolean> {
    await this.prisma.session.updateMany({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
      },
    });
    return true;
  }

  async logoutAll(userId: string): Promise<boolean> {
    await this.prisma.session.updateMany({
      where: {
        userId: userId,
        revokedAt: null,
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
      let errorMessage =
        'An unexpected error occurred during token validation.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error(`Token validation failed: ${errorMessage}`);

      return null;
    }
  }
}
