import { RoleAggregate } from '../aggregates/role.aggregate';

export interface PaginatedRoles {
  nodes: RoleAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
  findByName(name: string): Promise<RoleAggregate | null>;
  findById(id: string): Promise<RoleAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedRoles>;
}
