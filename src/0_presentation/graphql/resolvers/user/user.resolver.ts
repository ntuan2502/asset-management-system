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

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => UserType, { name: 'user', nullable: true })
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType | null> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Query(() => [UserType], { name: 'users' })
  async getAllUsers(): Promise<UserType[]> {
    return this.queryBus.execute(new GetAllUsersQuery());
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return this.commandBus.execute(new CreateUserCommand(input));
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserType> {
    return this.commandBus.execute(new UpdateUserCommand(id, input));
  }
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteUserCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  async restoreUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreUserCommand(id));
    return true;
  }
}
