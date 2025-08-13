import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDepartmentByIdQuery } from '../impl/get-department-by-id.query';
import {
  IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from 'src/2_domain/department/repositories/department.repository.interface';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';

@QueryHandler(GetDepartmentByIdQuery)
export class GetDepartmentByIdHandler
  implements IQueryHandler<GetDepartmentByIdQuery>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    query: GetDepartmentByIdQuery,
  ): Promise<DepartmentAggregate | null> {
    return this.departmentRepository.findById(query.id);
  }
}
