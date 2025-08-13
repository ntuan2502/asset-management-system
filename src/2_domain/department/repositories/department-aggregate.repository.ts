import { Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { DepartmentAggregate } from '../aggregates/department.aggregate';

@Injectable()
export class DepartmentAggregateRepository extends BaseAggregateRepository<DepartmentAggregate> {
  async findById(id: string): Promise<DepartmentAggregate> {
    return this.loadAggregate(id, DepartmentAggregate);
  }
}
