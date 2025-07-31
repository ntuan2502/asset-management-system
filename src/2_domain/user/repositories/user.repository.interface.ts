import { UserAggregate } from '../aggregates/user.aggregate';

// Dùng một token để inject, tránh phụ thuộc vào tên class
export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(user: UserAggregate): Promise<UserAggregate>;
  findById(id: string): Promise<UserAggregate | null>;
  findByEmail(email: string): Promise<UserAggregate | null>;
  findAll(): Promise<UserAggregate[]>; // << THÊM DÒNG NÀY
  softDelete(id: string): Promise<void>; // << THÊM MỚI
}
