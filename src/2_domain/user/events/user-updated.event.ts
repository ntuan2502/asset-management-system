import { IEvent } from '@nestjs/cqrs';

// Định nghĩa payload cho sự kiện cập nhật
// Tất cả các trường đều là tùy chọn
export interface UserUpdatedPayload {
  id: string; // ID của user được cập nhật
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string | null;
  updatedAt: Date; // Thời điểm cập nhật
}

export class UserUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly dob?: Date;
  public readonly gender?: string | null;
  public readonly updatedAt: Date;

  constructor(payload: UserUpdatedPayload) {
    Object.assign(this, payload);

    // --- THÊM PHẦN CHUYỂN ĐỔI ---
    if (this.dob) {
      this.dob = new Date(this.dob);
    }
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
