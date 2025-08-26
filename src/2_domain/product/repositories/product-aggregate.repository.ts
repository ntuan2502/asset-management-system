import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { ProductAggregate } from '../aggregates/product.aggregate';

@Injectable()
export class ProductAggregateRepository extends BaseAggregateRepository<ProductAggregate> {
  async findById(id: string): Promise<ProductAggregate> {
    return this.loadAggregate(id, ProductAggregate);
  }
}
