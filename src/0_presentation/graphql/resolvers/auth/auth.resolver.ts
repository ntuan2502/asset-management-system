import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LoginResponse } from 'src/1_application/auth/dtos/login-response.dto';
import { LoginUserInput } from 'src/1_application/auth/dtos/login-user.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from 'src/2_domain/auth/decorators/current-user.decorator';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { AuthenticatedUser } from 'src/shared/types/context.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { SessionConnection } from 'src/1_application/auth/dtos/session-connection.type';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from 'src/shared/constants/pagination.constants';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // << INJECT
    private readonly configService: ConfigService, // << INJECT
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('input') input: LoginUserInput,
    @Context() context: { req: Request },
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Lấy IP và User-Agent từ request
    const ipAddress = context.req.ip;
    const userAgent = context.req.get('user-agent');

    return this.authService.login(user, ipAddress, userAgent);
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Args('refresh_token') refreshToken: string,
  ): Promise<LoginResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      // SỬA LỖI: Định kiểu cho payload trả về
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid refresh token payload.');
      }

      // SỬA LỖI: Truyền đúng payload.sub
      return this.authService.refreshToken(payload.sub, refreshToken);
    } catch (error) {
      // << SỬA LẠI: Bỏ `_` đi và sử dụng biến
      // Ghi lại log lỗi thực sự để debug (rất hữu ích)
      console.error('Refresh token validation failed:', error);
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }
  }

  // Logout phiên hiện tại
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  // Sửa kiểu của `user` thành AuthenticatedUser
  async logout(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    const sessionId = user.sessionId; // << Hoàn toàn an toàn về kiểu
    if (!sessionId) {
      throw new UnauthorizedException('Session ID not found in token.');
    }
    return this.authService.logout(sessionId); // << Hoàn toàn an toàn về kiểu
  }

  // Logout tất cả các phiên
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard) // Cần đăng nhập để biết user nào cần logout all
  async logoutAll(@CurrentUser() user: UserAggregate): Promise<boolean> {
    return this.authService.logoutAll(user.id);
  }

  @Query(() => SessionConnection, { name: 'sessions' })
  @UseGuards(GqlAuthGuard)
  async getActiveSessions(
    @CurrentUser() user: AuthenticatedUser,
    @Args() args: PaginationArgs,
  ) {
    const page = args.page ?? DEFAULT_PAGE;
    const limit = args.limit ?? DEFAULT_LIMIT;

    const result = await this.authService.getActiveSessions(user.id, {
      page,
      limit,
    });

    const totalPages = Math.ceil(result.meta.totalCount / limit);

    return {
      nodes: result.nodes,
      meta: {
        ...result.meta,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
