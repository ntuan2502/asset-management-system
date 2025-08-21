import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllAttributesQuery } from '../impl/get-all-attributes.query';
import {
  IAttributeRepository,
  ATTRIBUTE_REPOSITORY,
} from 'src/2_domain/attribute/repositories/attribute.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';
export type PaginatedAttributesResult = {
  nodes: AttributeAggregate[];
  meta: PaginationMeta;
};
@QueryHandler(GetAllAttributesQuery)
export class GetAllAttributesHandler
  implements IQueryHandler<GetAllAttributesQuery, PaginatedAttributesResult>
{
  constructor(
    @Inject(ATTRIBUTE_REPOSITORY)
    private readonly attributeRepository: IAttributeRepository,
  ) {}
  async execute(
    query: GetAllAttributesQuery,
  ): Promise<PaginatedAttributesResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;
    const result = await this.attributeRepository.findAll({ page, limit });
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
