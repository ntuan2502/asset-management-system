import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteUserCommand } from '../impl/delete-user.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { EventFactory } from 'src/shared/factories/event.factory'; // << IMPORT

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    // 1. **Tải lịch sử sự kiện**
    const history = await this.eventStore.getEventsForAggregate(id);
    if (history.length === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // SỬA LỖI: Dùng EventFactory để tái tạo các sự kiện với đúng kiểu
    const typedHistory = EventFactory.fromHistory(history);
    // 2. **Tái tạo Aggregate từ Lịch sử**
    const userAggregate = new UserAggregate();
    // loadFromHistory sẽ áp dụng lại các sự kiện cũ để có được trạng thái hiện tại
    // Bây giờ chúng ta truyền vào một mảng IEvent[] an toàn
    userAggregate.loadFromHistory(typedHistory);

    const user = this.publisher.mergeObjectContext(userAggregate);

    // 3. **Thực thi Logic Nghiệp vụ**
    user.deleteUser();

    // 4. **Lấy và Lưu Sự kiện mới**
    const events = user.getUncommittedEvents();
    // Phiên bản mong đợi là phiên bản hiện tại của aggregate
    await this.eventStore.saveEvents(id, 'User', events, user.version);

    // 5. **Commit và Publish**
    user.commit();
  }
}
