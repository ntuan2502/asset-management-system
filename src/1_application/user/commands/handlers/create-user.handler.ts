import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from '../impl/create-user.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { input } = command;

    // Sau này có thể kiểm tra logic nghiệp vụ phức tạp ở đây
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const newUser = new UserAggregate();
    newUser.email = input.email;
    newUser.firstName = input.firstName;
    newUser.lastName = input.lastName;

    return this.userRepository.create(newUser);
  }
}
