import { RoleAggregate } from '../aggregates/role.aggregate';

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
  findByName(name: string): Promise<RoleAggregate | null>;
  findById(id: string): Promise<RoleAggregate | null>;
  findAll(): Promise<RoleAggregate[]>;
}
