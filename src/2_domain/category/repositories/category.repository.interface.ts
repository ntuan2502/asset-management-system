import { CategoryAggregate } from '../aggregates/category.aggregate';

export interface PaginatedCategories {
  nodes: CategoryAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface ICategoryRepository {
  findByName(name: string): Promise<CategoryAggregate | null>;
  findById(id: string): Promise<CategoryAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedCategories>;
}
