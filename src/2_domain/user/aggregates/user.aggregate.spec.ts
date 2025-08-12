import { UserAggregate } from './user.aggregate';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { UserCreatedEvent } from '../events/user-created.event';

// describe: Nhóm các bài test cho UserAggregate
describe('UserAggregate', () => {
  // it: Mô tả một kịch bản test cụ thể
  it('should apply a UserCreatedEvent and update state correctly', () => {
    // --- 1. Sắp đặt (Arrange) ---
    const aggregate = new UserAggregate();
    const userData = {
      id: 'user-123',
      email: 'test@example.com',
      hashedPassword: 'hashed-password',
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-15T00:00:00.000Z'),
      gender: 'MALE',
    };

    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T10:00:00.000Z'));

    // --- 2. Hành động (Act) ---
    aggregate.createUser(userData);

    // --- 3. Khẳng định (Assert) ---
    const uncommittedEvents = aggregate.getUncommittedEvents();
    const createdEvent = uncommittedEvents[0];

    // **Khẳng định tường minh cho những phần quan trọng nhất**
    // "Tôi khẳng định rằng PHẢI có đúng 1 sự kiện được phát ra"
    expect(uncommittedEvents).toHaveLength(1);
    // "Và sự kiện đó PHẢI là UserCreatedEvent"
    expect(createdEvent).toBeInstanceOf(UserCreatedEvent);
    // "Và ID của nó PHẢI khớp với ID tôi đã cung cấp"
    expect((createdEvent as UserCreatedEvent).id).toBe(userData.id);

    // **Dùng Snapshot để kiểm tra phần còn lại**
    // "Bây giờ, hãy chụp ảnh toàn bộ sự kiện để đảm bảo các trường khác
    // (firstName, lastName, dob...) không bị thay đổi ngoài ý muốn."
    expect(createdEvent).toMatchSnapshot();

    // Tương tự, kiểm tra trạng thái của aggregate
    // "Tôi khẳng định rằng ID và Email của aggregate PHẢI được cập nhật đúng"
    expect(aggregate.id).toBe(userData.id);
    expect(aggregate.email).toBe(userData.email);
    // "Và bây giờ, chụp ảnh phần còn lại của aggregate"
    expect(aggregate).toMatchSnapshot();

    jest.useRealTimers();
  });

  it('should apply UserDeletedEvent when deleting an active user', () => {
    // 1. Arrange
    // Tạo một user đã được khởi tạo (giống như đã có UserCreatedEvent)
    // để có ID và trạng thái active.
    const aggregate = new UserAggregate();
    aggregate.id = 'user-123';
    aggregate.deletedAt = null; // Tường minh hóa trạng thái active

    // 2. Act
    aggregate.deleteUser();

    // 3. Assert
    const uncommittedEvents = aggregate.getUncommittedEvents();

    // Khẳng định rằng có một sự kiện được phát ra
    expect(uncommittedEvents).toHaveLength(1);

    // Khẳng định rằng đó là đúng sự kiện UserDeletedEvent
    const event = uncommittedEvents[0];
    expect(event).toBeInstanceOf(UserDeletedEvent);
    expect((event as UserDeletedEvent).id).toBe('user-123');

    // (Tùy chọn) Khẳng định rằng trạng thái nội bộ của aggregate đã được cập nhật
    expect(aggregate.deletedAt).not.toBeNull();
  });

  it('should throw an error when trying to delete an already deleted user', () => {
    // --- 1. Sắp đặt (Arrange) ---
    // Tạo một user đã ở trạng thái bị xóa
    const aggregate = new UserAggregate();
    // Giả lập trạng thái đã bị xóa
    aggregate.deletedAt = new Date();

    // --- 2. Hành động & 3. Khẳng định (Act & Assert) ---
    // Chúng ta mong đợi rằng khi gọi `deleteUser`, một lỗi sẽ được ném ra.
    // Chúng ta bọc hành động trong một arrow function.
    const action = () => aggregate.deleteUser();

    // `toThrow` kiểm tra xem hàm có ném ra lỗi không.
    // Bạn cũng có thể kiểm tra nội dung của thông báo lỗi.
    expect(action).toThrow(
      'Cannot delete a user that has already been deleted.',
    );
  });

  it('should throw an error when trying to restore an already active user', () => {
    const aggregate = new UserAggregate();
    const action = () => aggregate.restoreUser();
    expect(action).toThrow('Cannot restore an active user.');
  });
});
