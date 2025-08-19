import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { CategoryAggregate } from '../aggregates/category.aggregate';

@Injectable()
export class CategoryAggregateRepository extends BaseAggregateRepository<CategoryAggregate> {
  async findById(id: string): Promise<CategoryAggregate> {
    return this.loadAggregate(id, CategoryAggregate);
  }
}
