import { AttributeAggregate } from '../aggregates/attribute.aggregate';
export interface PaginatedAttributes {
  nodes: AttributeAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}
export const ATTRIBUTE_REPOSITORY = 'ATTRIBUTE_REPOSITORY';
export interface IAttributeRepository {
  findByName(name: string): Promise<AttributeAggregate | null>;
  findById(id: string): Promise<AttributeAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedAttributes>;
}
