import { IEvent } from '@nestjs/cqrs';
import { StoredEvent } from 'src/3_infrastructure/event-store/event-store.interface';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event'; // << IMPORT

// Định nghĩa một kiểu cho constructor của các sự kiện
// Nó là một class có thể được `new` và là một subtype của IEvent
type EventConstructor = new (...args: any[]) => IEvent;

// Một đối tượng map tên sự kiện với lớp sự kiện tương ứng
// Giờ đây nó có kiểu rõ ràng
const eventConstructors: { [key: string]: EventConstructor } = {
  [UserCreatedEvent.name]: UserCreatedEvent,
  [UserDeletedEvent.name]: UserDeletedEvent,
  [UserUpdatedEvent.name]: UserUpdatedEvent, // << THÊM DÒNG NÀY
};

export class EventFactory {
  public static create(storedEvent: StoredEvent): IEvent {
    const constructor = eventConstructors[storedEvent.eventType];
    if (!constructor) {
      throw new Error(`Event type ${storedEvent.eventType} not recognized.`);
    }

    // VÌ CONSTRUCTOR GIỜ ĐÂY NHẬN VÀO MỘT OBJECT PAYLOAD,
    // VIỆC TÁI TẠO TRỞ NÊN CỰC KỲ ĐƠN GIẢN VÀ AN TOÀN.
    // TypeScript hiểu rằng chúng ta đang truyền payload vào một constructor
    // đã được định nghĩa để xử lý nó.
    return new constructor(storedEvent.payload);
  }

  public static fromHistory(history: StoredEvent[]): IEvent[] {
    // SỬA LỖI: Dùng arrow function để bảo toàn ngữ cảnh của `this`
    return history.map((event) => this.create(event));
  }
}
