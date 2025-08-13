import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllDepartmentsQuery } from '../impl/get-all-departments.query';
import {
  IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from 'src/2_domain/department/repositories/department.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';

export type PaginatedDepartmentsResult = {
  nodes: DepartmentAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllDepartmentsQuery)
export class GetAllDepartmentsHandler
  implements IQueryHandler<GetAllDepartmentsQuery, PaginatedDepartmentsResult>
{
  constructor(
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    query: GetAllDepartmentsQuery,
  ): Promise<PaginatedDepartmentsResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;

    const result = await this.departmentRepository.findAll({ page, limit });

    const totalPages = Math.ceil(result.meta.totalCount / limit);

    return {
      nodes: result.nodes,
      meta: {
        ...result.meta,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
