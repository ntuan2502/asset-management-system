import { DepartmentAggregate } from '../aggregates/department.aggregate';
export interface PaginatedDepartments {
  nodes: DepartmentAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}
export const DEPARTMENT_REPOSITORY = 'DEPARTMENT_REPOSITORY';
export interface IDepartmentRepository {
  doesNameExistInOffice(name: string, officeId: string): Promise<boolean>;
  findById(id: string): Promise<DepartmentAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedDepartments>;
}
