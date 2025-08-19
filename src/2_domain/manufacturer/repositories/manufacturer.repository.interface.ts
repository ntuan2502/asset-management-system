import { ManufacturerAggregate } from '../aggregates/manufacturer.aggregate';

export interface PaginatedCategories {
  nodes: ManufacturerAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const MANUFACTURER_REPOSITORY = 'MANUFACTURER_REPOSITORY';

export interface IManufacturerRepository {
  findByName(name: string): Promise<ManufacturerAggregate | null>;
  findById(id: string): Promise<ManufacturerAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedCategories>;
}
