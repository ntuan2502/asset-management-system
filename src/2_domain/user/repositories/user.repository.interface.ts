import { UserAggregate } from '../aggregates/user.aggregate';

export type UserWithPermissions = UserAggregate & {
  permissions: { action: string; subject: string }[];
};

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(user: UserAggregate): Promise<UserAggregate>;
  findById(id: string): Promise<UserAggregate | null>;
  findByEmail(email: string): Promise<UserAggregate | null>;
  findAll(): Promise<UserAggregate[]>;
  softDelete(id: string): Promise<void>;
  findWithPermissionsByEmail(
    email: string,
  ): Promise<UserWithPermissions | null>;
  findWithPermissionsById(id: string): Promise<UserWithPermissions | null>;
}
