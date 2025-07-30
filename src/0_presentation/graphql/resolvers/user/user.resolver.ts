import {
  Args,
  Mutation,
  Resolver,
  ObjectType,
  Field,
  ID,
} from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserInput } from 'src/1_application/user/dtos/create-user.input';
import { CreateUserCommand } from 'src/1_application/user/commands/impl/create-user.command';

// Không cần import UserAggregate ở đây nữa

// Định nghĩa UserType như một class độc lập.
// Đây là "hình dạng" dữ liệu mà GraphQL API sẽ trả về.
@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    // CommandBus.execute sẽ trả về một UserAggregate.
    // Vì UserAggregate và UserType có cấu trúc tương tự (duck typing),
    // TypeScript sẽ cho phép điều này.
    // Kết quả trả về cho client sẽ được định dạng theo UserType.
    return this.commandBus.execute(new CreateUserCommand(input));
  }
}
