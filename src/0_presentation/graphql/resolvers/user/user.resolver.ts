import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs'; // << Thêm QueryBus
import { CreateUserInput } from 'src/1_application/user/dtos/create-user.input';
import { CreateUserCommand } from 'src/1_application/user/commands/impl/create-user.command';
import { UserType } from './user.type'; // << Tạo file riêng cho UserType
import { GetUserByIdQuery } from 'src/1_application/user/queries/impl/get-user-by-id.query'; // << Import Query

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus, // << Inject QueryBus
  ) {}

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return this.commandBus.execute(new CreateUserCommand(input));
  }

  // --- THÊM MỚI ---
  @Query(() => UserType, { name: 'user', nullable: true })
  async getUserById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType | null> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }
}
