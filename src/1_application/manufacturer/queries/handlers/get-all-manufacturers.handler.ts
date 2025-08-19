import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllManufacturersQuery } from '../impl/get-all-manufacturers.query';
import {
  IManufacturerRepository,
  MANUFACTURER_REPOSITORY,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';

export type PaginatedManufacturersResult = {
  nodes: ManufacturerAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllManufacturersQuery)
export class GetAllManufacturersHandler
  implements
    IQueryHandler<GetAllManufacturersQuery, PaginatedManufacturersResult>
{
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(
    query: GetAllManufacturersQuery,
  ): Promise<PaginatedManufacturersResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;
    const result = await this.manufacturerRepository.findAll({ page, limit });
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
