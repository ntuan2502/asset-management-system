import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserDeletedEvent } from '../events/user-deleted.event';

export class UserAggregate extends AggregateRoot {
  // Trạng thái bên trong của Aggregate
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date | null;
  gender: string | null;
  createdAt: Date;
  updatedAt: Date;
  public deletedAt: Date | null = null; // Thêm trạng thái deletedAt

  // Phiên bản của aggregate, dùng để kiểm soát tương tranh
  public version = 0;

  constructor() {
    super();
    // Bật tính năng auto-commit của NestJS CQRS.
    // Điều này có nghĩa là các sự kiện sẽ được publish tự động sau khi handler hoàn thành.
    // Chúng ta không dùng autoCommit nữa, sẽ commit thủ công để rõ ràng hơn
    // this.autoCommit = true;
  }

  // --- Các phương thức nghiệp vụ (Commands) ---
  // --- Các phương thức nghiệp vụ để phát ra sự kiện ---

  public createUser(
    id: string,
    email: string,
    hashedPassword: string,
    firstName: string,
    lastName: string,
    dob?: Date | null,
    gender?: string | null,
  ) {
    const createdAt = new Date(); // Tạo timestamp tại thời điểm nghiệp vụ xảy ra
    // Phương thức apply() được kế thừa từ AggregateRoot.
    // Nó sẽ gọi phương thức onUserCreatedEvent() tương ứng và thêm sự kiện vào hàng đợi.
    // Truyền vào một object thay vì một danh sách tham số
    this.apply(
      new UserCreatedEvent({
        id,
        email,
        hashedPassword,
        firstName,
        lastName,
        dob,
        gender,
        createdAt, // << Truyền timestamp vào sự kiện
      }),
    );
  }

  public deleteUser() {
    if (this.deletedAt) {
      // Không thể xóa người dùng đã bị xóa
      return;
    }
    // Truyền vào một object
    this.apply(new UserDeletedEvent({ id: this.id }));
  }

  // --- Các phương thức xử lý sự kiện (Event Handlers) ---
  // Tên phương thức on<EventName> là một quy ước được AggregateRoot nhận biết.
  // Phương thức này không còn được dùng để tạo mới từ bên ngoài,
  // mà sẽ được dùng để áp dụng sự kiện lên trạng thái.
  onUserCreatedEvent(event: UserCreatedEvent) {
    this.id = event.id;
    this.email = event.email;
    this.password = event.hashedPassword;
    this.firstName = event.firstName;
    this.lastName = event.lastName;
    // SỬA LỖI: Nếu event.dob là undefined, hãy dùng null
    this.dob = event.dob ?? null;

    // SỬA LỖI: Nếu event.gender là undefined, hãy dùng null
    this.gender = event.gender ?? null;
    this.createdAt = event.createdAt; // << GÁN GIÁ TRỊ TỪ SỰ KIỆN
    this.updatedAt = event.createdAt; // << Khi mới tạo, updatedAt bằng createdAt
    this.version++;
  }

  protected onUserDeletedEvent(_event: UserDeletedEvent) {
    this.deletedAt = new Date();
    this.version++;
  }

  // --- Các phương thức tái tạo (Rehydration) ---
  // Chúng ta không cần tự viết loadFromHistory nữa.
  // NestJS CQRS cung cấp một EventPublisher sẽ làm điều này cho chúng ta.

  public loadFromHistory(history: IEvent[]) {
    history.forEach((event) => this.apply(event, true));
  }
}
