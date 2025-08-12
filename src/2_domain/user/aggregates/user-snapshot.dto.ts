import { Type } from 'class-transformer';

export class UserSnapshotDto {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

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
