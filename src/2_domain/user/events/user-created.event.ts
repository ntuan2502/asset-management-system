import { IEvent } from '@nestjs/cqrs';

// Định nghĩa một interface cho payload để có type-safety
interface UserCreatedPayload {
  id: string;
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  dob?: Date | null; // << THÊM MỚI
  gender?: string | null; // << THÊM MỚI
  createdAt: Date; // << THÊM MỚI
}

export class UserCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly email: string;
  public readonly hashedPassword: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly dob?: Date | null; // << THÊM MỚI
  public readonly gender?: string | null; // << THÊM MỚI
  public readonly createdAt: Date; // << THÊM MỚI

  // Constructor giờ đây nhận một đối tượng duy nhất
  constructor(payload: UserCreatedPayload) {
    Object.assign(this, payload);
  }
}
