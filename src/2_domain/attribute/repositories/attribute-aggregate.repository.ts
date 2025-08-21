import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { AttributeAggregate } from '../aggregates/attribute.aggregate';

@Injectable()
export class AttributeAggregateRepository extends BaseAggregateRepository<AttributeAggregate> {
  async findById(id: string): Promise<AttributeAggregate> {
    return this.loadAggregate(id, AttributeAggregate);
  }
}
