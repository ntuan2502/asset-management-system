import { ProductAggregate } from '../aggregates/product.aggregate';
export interface PaginatedProducts {
  nodes: ProductAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}
export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
export interface IProductRepository {
  findByName(name: string): Promise<ProductAggregate | null>;
  findById(id: string): Promise<ProductAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedProducts>;
}
