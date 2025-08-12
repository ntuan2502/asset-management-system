import { PermissionAggregate } from '../aggregates/permission.aggregate';

export interface PaginatedPermissions {
  nodes: PermissionAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const PERMISSION_REPOSITORY = 'PERMISSION_REPOSITORY';
export interface IPermissionRepository {
  findAll(args: { page: number; limit: number }): Promise<PaginatedPermissions>;
}
