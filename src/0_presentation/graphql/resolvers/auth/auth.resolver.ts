import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
// Import DTOs, Guards, Decorators
import { LoginResponse } from 'src/1_application/auth/dtos/login-response.dto';
import { LoginUserInput } from 'src/1_application/auth/dtos/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/2_domain/auth/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/shared/types/context.types';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { SessionConnection } from 'src/1_application/auth/dtos/session-connection.type';
// Import Commands & Queries
import { LoginCommand } from 'src/1_application/auth/commands/impl/login.command';
import { RefreshTokenCommand } from 'src/1_application/auth/commands/impl/refresh-token.command';
import { LogoutCommand } from 'src/1_application/auth/commands/impl/logout.command';
import { LogoutAllCommand } from 'src/1_application/auth/commands/impl/logout-all.command';
import { GetActiveSessionsQuery } from 'src/1_application/auth/queries/impl/get-active-sessions.query';
import { PaginatedSessionsResult } from 'src/1_application/auth/queries/handlers/get-active-sessions.handler';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('input') input: LoginUserInput,
    @Context() context: { req: Request },
  ): Promise<LoginResponse> {
    const ipAddress = context.req.ip;
    const userAgent = context.req.get('user-agent');
    return this.commandBus.execute(
      new LoginCommand(input, ipAddress, userAgent),
    );
  }

  @Mutation(() => LoginResponse)
  async refreshToken(
    @Args('refresh_token') refreshToken: string,
  ): Promise<LoginResponse> {
    return this.commandBus.execute(new RefreshTokenCommand(refreshToken));
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    await this.commandBus.execute(new LogoutCommand(user));
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logoutAll(@CurrentUser() user: AuthenticatedUser): Promise<boolean> {
    await this.commandBus.execute(new LogoutAllCommand(user));
    return true;
  }

  @Query(() => SessionConnection, { name: 'sessions' })
  @UseGuards(GqlAuthGuard)
  async getActiveSessions(
    @CurrentUser() user: AuthenticatedUser,
    @Args() args: PaginationArgs,
  ): Promise<PaginatedSessionsResult> {
    return this.queryBus.execute(new GetActiveSessionsQuery(user, args));
  }
}
