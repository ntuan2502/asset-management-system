import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { OfficeAggregate } from '../aggregates/office.aggregate';

@Injectable()
export class OfficeAggregateRepository extends BaseAggregateRepository<OfficeAggregate> {
  async findById(id: string): Promise<OfficeAggregate> {
    return this.loadAggregate(id, OfficeAggregate);
  }
}
