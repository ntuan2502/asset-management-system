import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetStatusLabelByIdQuery } from '../impl/get-status-label-by-id.query';
import {
  IStatusLabelRepository,
  STATUS_LABEL_REPOSITORY,
} from 'src/2_domain/status-label/repositories/status-label.repository.interface';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';

@QueryHandler(GetStatusLabelByIdQuery)
export class GetStatusLabelByIdHandler
  implements IQueryHandler<GetStatusLabelByIdQuery, StatusLabelAggregate | null>
{
  constructor(
    @Inject(STATUS_LABEL_REPOSITORY)
    private readonly statusLabelRepository: IStatusLabelRepository,
  ) {}

  async execute(
    query: GetStatusLabelByIdQuery,
  ): Promise<StatusLabelAggregate | null> {
    return this.statusLabelRepository.findById(query.id);
  }
}
