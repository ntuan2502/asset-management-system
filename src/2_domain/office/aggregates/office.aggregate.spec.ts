import { OfficeAggregate } from './office.aggregate';
import { OfficeCreatedEvent } from '../events/office-created.event';
import { OfficeUpdatedEvent } from '../events/office-updated.event';
import { DEPARTMENT_ERRORS } from 'src/shared/constants/error-messages.constants';

// Mock thư viện cuid2 để ID được tạo ra là cố định, giúp snapshot ổn định
jest.mock('@paralleldrive/cuid2', () => ({
  createId: jest.fn(() => 'mock-cuid-12345'),
}));

describe('OfficeAggregate', () => {
  // Dọn dẹp mock sau mỗi bài test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOffice', () => {
    it('should apply an OfficeCreatedEvent and set initial state', () => {
      // --- Arrange ---
      const aggregate = new OfficeAggregate();
      const officeData = {
        name: 'Amata Vietnam JSC',
        internationalName: 'Amata Vietnam Joint Stock Company',
        shortName: 'AMATAVN',
        taxCode: '0123456789',
        address: '123 Main St, HCMC',
        description: 'Headquarters',
      };

      // Đóng băng thời gian để snapshot ổn định
      jest.useFakeTimers().setSystemTime(new Date('2025-01-01T10:00:00.000Z'));

      // --- Act ---
      aggregate.createOffice(officeData);

      // --- Assert ---
      const uncommittedEvents = aggregate.getUncommittedEvents();
      const createdEvent = uncommittedEvents[0];

      // 1. Khẳng định tường minh (Explicit Assertions)
      expect(uncommittedEvents).toHaveLength(1);
      expect(createdEvent).toBeInstanceOf(OfficeCreatedEvent);
      expect((createdEvent as OfficeCreatedEvent).id).toBe('mock-cuid-12345');
      expect((createdEvent as OfficeCreatedEvent).name).toBe(officeData.name);

      // 2. Khẳng định bằng Snapshot
      //    Chụp ảnh sự kiện để đảm bảo tất cả các trường khác đều đúng
      expect(createdEvent).toMatchSnapshot();

      //    Chụp ảnh trạng thái của aggregate để đảm bảo `onOfficeCreatedEvent` hoạt động đúng
      expect(aggregate).toMatchSnapshot();

      // Dọn dẹp mock thời gian
      jest.useRealTimers();
    });
  });

  describe('updateOffice', () => {
    // Tạo một hàm helper để tái sử dụng việc thiết lập trạng thái
    const createExistingOffice = (): OfficeAggregate => {
      const aggregate = new OfficeAggregate();
      // Gán trạng thái trực tiếp, mô phỏng một office đã tồn tại
      aggregate.id = 'office-123';
      aggregate.name = 'Old Name';
      aggregate.internationalName = 'Old International Name';
      aggregate.shortName = 'OLD';
      aggregate.taxCode = '12345';
      aggregate.address = 'Old Address';
      aggregate.description = 'Old Description';
      aggregate.deletedAt = null;
      aggregate.createdAt = new Date('2025-01-01T00:00:00.000Z');
      aggregate.updatedAt = new Date('2025-01-01T00:00:00.000Z');
      aggregate.version = 1;
      return aggregate;
    };

    it('should apply an OfficeUpdatedEvent when data changes', () => {
      // --- Arrange ---
      const aggregate = createExistingOffice();
      const updatePayload = {
        name: 'New Name',
        description: 'New Description',
      };

      // Đóng băng thời gian cho `updatedAt` trong sự kiện
      jest.useFakeTimers().setSystemTime(new Date('2025-02-02T11:00:00.000Z'));

      // --- Act ---
      aggregate.updateOffice(updatePayload);

      // --- Assert ---
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(OfficeUpdatedEvent);

      // Chụp ảnh sự kiện update (chỉ chứa các thay đổi)
      expect(uncommittedEvents[0]).toMatchSnapshot('event');
      // Chụp ảnh trạng thái cuối cùng của aggregate
      expect(aggregate).toMatchSnapshot('aggregate state');

      jest.useRealTimers();
    });

    it('should not apply an event if no data has changed', () => {
      // --- Arrange ---
      const aggregate = createExistingOffice();
      // Gửi lại dữ liệu giống hệt trạng thái hiện tại
      const updatePayload = { name: 'Old Name' };

      // --- Act ---
      aggregate.updateOffice(updatePayload);

      // --- Assert ---
      // Mong đợi không có sự kiện nào được phát ra
      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should throw an error when updating a deleted office', () => {
      // --- Arrange ---
      const aggregate = createExistingOffice();
      aggregate.deletedAt = new Date(); // Giả lập trạng thái đã bị xóa

      // --- Act & Assert ---
      const action = () => aggregate.updateOffice({ name: 'New Name' });
      expect(action).toThrow(DEPARTMENT_ERRORS.CANNOT_UPDATE_DELETED);
    });
  });
});
