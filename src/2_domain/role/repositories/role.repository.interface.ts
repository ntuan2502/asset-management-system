import { PermissionAggregate } from 'src/2_domain/permission/aggregates/permission.aggregate';
import { RoleAggregate } from '../aggregates/role.aggregate';

export interface PaginatedRoles {
  nodes: RoleAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export type RoleWithPermissions = RoleAggregate & {
  permissions: PermissionAggregate[];
};

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
  findByName(name: string): Promise<RoleAggregate | null>;
  findById(id: string): Promise<RoleAggregate | null>;
  findByIds(ids: string[]): Promise<RoleAggregate[]>;
  findByIdWithPermissions(id: string): Promise<RoleWithPermissions | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedRoles>;
}
