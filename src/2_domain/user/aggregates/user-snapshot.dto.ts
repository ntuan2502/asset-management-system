import { Type } from 'class-transformer';

// Đây không còn là interface, mà là một class
export class UserSnapshotDto {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  // Decorator @Type sẽ tự động chuyển đổi giá trị thành đối tượng Date
  @Type(() => Date)
  dob: Date | null;

  gender: string | null;

  @Type(() => Date)
  deletedAt: Date | null;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  version: number;
}
