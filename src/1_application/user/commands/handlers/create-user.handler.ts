import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as cuid from 'cuid'; // << THAY THẾ UUID BẰNG CUID

import { CreateUserCommand } from '../impl/create-user.command';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/2_domain/user/repositories/user.repository.interface';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher, // << INJECT EVENT PUBLISHER
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore, // << INJECT EVENT STORE
    // Chúng ta vẫn giữ repository ở đây, nhưng chỉ cho một mục đích:
    // kiểm tra sự tồn tại của email trên "Read Model" để tránh trùng lặp.
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { input } = command;

    // 1. **Validation (trên Read Model)**: Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // 2. **Hashing Mật khẩu**
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);
    const newUserId = cuid();

    // 3. **Tạo và Kết nối Aggregate với EventBus**
    // mergeObjectContext sẽ biến `user` thành một đối tượng "live" có thể publish sự kiện
    const user = this.publisher.mergeObjectContext(new UserAggregate());

    // 4. **Thực thi Logic Nghiệp vụ**
    // Gọi phương thức nghiệp vụ trên aggregate, nó sẽ `apply()` một sự kiện mới
    user.createUser(
      newUserId,
      input.email,
      hashedPassword,
      input.firstName,
      input.lastName,
      input.dob, // << THÊM MỚI
      input.gender, // << THÊM MỚI
    );

    // 5. **Lấy và Lưu Sự kiện vào Event Store**
    const events = user.getUncommittedEvents();
    // Phiên bản mong đợi là 0 vì đây là aggregate mới toanh
    await this.eventStore.saveEvents(newUserId, 'User', events, 0);

    // 6. **Commit và Publish**
    // `commit()` sẽ publish các sự kiện lên EventBus để các thành phần khác (như Projector) lắng nghe
    user.commit();

    // Trả về aggregate với trạng thái mới nhất
    return user;
  }
}
