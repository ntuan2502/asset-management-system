import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllStatusLabelsQuery } from '../impl/get-all-status-labels.query';
import {
  IStatusLabelRepository,
  STATUS_LABEL_REPOSITORY,
} from 'src/2_domain/status-label/repositories/status-label.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';

export type PaginatedStatusLabelsResult = {
  nodes: StatusLabelAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllStatusLabelsQuery)
export class GetAllStatusLabelsHandler
  implements IQueryHandler<GetAllStatusLabelsQuery, PaginatedStatusLabelsResult>
{
  constructor(
    @Inject(STATUS_LABEL_REPOSITORY)
    private readonly statusLabelRepository: IStatusLabelRepository,
  ) {}

  async execute(
    query: GetAllStatusLabelsQuery,
  ): Promise<PaginatedStatusLabelsResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;
    const result = await this.statusLabelRepository.findAll({ page, limit });
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
