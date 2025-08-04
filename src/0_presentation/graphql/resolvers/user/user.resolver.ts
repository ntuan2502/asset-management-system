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

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => UserType, { name: 'user', nullable: true })
  @UseGuards(GqlAuthGuard)
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType | null> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Query(() => [UserType], { name: 'users' })
  @UseGuards(GqlAuthGuard)
  async getAllUsers(): Promise<UserType[]> {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return this.commandBus.execute(new CreateUserCommand(input));
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserType> {
    return this.commandBus.execute(new UpdateUserCommand(id, input));
  }
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async restoreUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreUserCommand(id));
    return true;
  }

  @Query(() => UserType, { name: 'me' })
  @UseGuards(GqlAuthGuard) // Phải được bảo vệ để có `req.user`
  me(@CurrentUser() user: UserAggregate): UserAggregate {
    // `user` ở đây chính là đối tượng UserAggregate đầy đủ
    // đã được trả về từ `validate()` của JwtStrategy.
    return user;
  }
}
