import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { StatusLabelAggregate } from '../aggregates/status-label.aggregate';

@Injectable()
export class StatusLabelAggregateRepository extends BaseAggregateRepository<StatusLabelAggregate> {
  async findById(id: string): Promise<StatusLabelAggregate> {
    return this.loadAggregate(id, StatusLabelAggregate);
  }
}
