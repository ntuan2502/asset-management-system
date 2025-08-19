import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { ManufacturerAggregate } from '../aggregates/manufacturer.aggregate';

@Injectable()
export class ManufacturerAggregateRepository extends BaseAggregateRepository<ManufacturerAggregate> {
  async findById(id: string): Promise<ManufacturerAggregate> {
    return this.loadAggregate(id, ManufacturerAggregate);
  }
}
