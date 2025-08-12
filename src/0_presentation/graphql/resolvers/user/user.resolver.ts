import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserInput } from 'src/1_application/user/dtos/create-user.input';
import { CreateUserCommand } from 'src/1_application/user/commands/impl/create-user.command';
import { UserType } from './user.type';
import { GetUserByIdQuery } from 'src/1_application/user/queries/impl/get-user-by-id.query';
import { GetAllUsersQuery } from 'src/1_application/user/queries/impl/get-all-users.query';
import { DeleteUserCommand } from 'src/1_application/user/commands/impl/delete-user.command';
import { UpdateUserInput } from 'src/1_application/user/dtos/update-user.input';
import { UpdateUserCommand } from 'src/1_application/user/commands/impl/update-user.command';
import { RestoreUserCommand } from 'src/1_application/user/commands/impl/restore-user.command';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/2_domain/auth/decorators/current-user.decorator';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { AssignRoleToUserCommand } from 'src/1_application/user/commands/impl/assign-role-to-user.command';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { AuthenticatedUser } from 'src/shared/types/context.types';
import { UserConnection } from './user-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedUsersResult } from 'src/1_application/user/queries/handlers/get-all-users.handler';

@Resolver(() => UserType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => UserType, { name: 'user', nullable: true })
  @CheckPermissions({ action: ACTIONS.READ, subject: SUBJECTS.USER })
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType | null> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Query(() => UserConnection, { name: 'users' })
  @CheckPermissions({ action: ACTIONS.READ, subject: SUBJECTS.USER })
  async getAllUsers(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedUsersResult> {
    return this.queryBus.execute<GetAllUsersQuery, PaginatedUsersResult>(
      new GetAllUsersQuery(args),
    );
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return this.commandBus.execute(new CreateUserCommand(input));
  }

  @Mutation(() => UserType)
  @CheckPermissions({ action: ACTIONS.UPDATE, subject: SUBJECTS.USER })
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserType> {
    return this.commandBus.execute(new UpdateUserCommand(id, input));
  }
  @Mutation(() => Boolean)
  @CheckPermissions({ action: ACTIONS.DELETE, subject: SUBJECTS.USER })
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({ action: ACTIONS.UPDATE, subject: SUBJECTS.USER })
  async restoreUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreUserCommand(id));
    return true;
  }

  @Query(() => UserType, { name: 'me' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Mutation(() => UserType)
  async assignRoleToUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('roleId', { type: () => ID }) roleId: string,
  ): Promise<UserAggregate> {
    return this.commandBus.execute(new AssignRoleToUserCommand(userId, roleId));
  }
}
