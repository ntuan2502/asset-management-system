import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllOfficesQuery } from '../impl/get-all-offices.query';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';

export type PaginatedOfficesResult = {
  nodes: OfficeAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllOfficesQuery)
export class GetAllOfficesHandler
  implements IQueryHandler<GetAllOfficesQuery, PaginatedOfficesResult>
{
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepository: IOfficeRepository,
  ) {}

  async execute(query: GetAllOfficesQuery): Promise<PaginatedOfficesResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;

    const result = await this.officeRepository.findAll({ page, limit });

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
