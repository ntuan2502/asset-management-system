import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // << IMPORT BCRYPT

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

    // --- BẮT ĐẦU PHẦN THAY ĐỔI ---

    // 1. Hashing mật khẩu
    const saltRounds = 10; // Số vòng lặp salt, 10 là giá trị tiêu chuẩn
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);

    // 2. Tạo đối tượng aggregate với mật khẩu ĐÃ ĐƯỢC HASH
    const newUser = new UserAggregate();
    newUser.email = input.email;
    newUser.password = hashedPassword; // << LƯU MẬT KHẨU ĐÃ HASH
    newUser.firstName = input.firstName;
    newUser.lastName = input.lastName;

    // --- KẾT THÚC PHẦN THAY ĐỔI ---

    return this.userRepository.create(newUser);
  }
}
