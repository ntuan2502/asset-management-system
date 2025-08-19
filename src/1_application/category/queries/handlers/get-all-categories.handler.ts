import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllCategoriesQuery } from '../impl/get-all-categories.query';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from 'src/2_domain/category/repositories/category.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';

export type PaginatedCategoriesResult = {
  nodes: CategoryAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler
  implements IQueryHandler<GetAllCategoriesQuery, PaginatedCategoriesResult>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    query: GetAllCategoriesQuery,
  ): Promise<PaginatedCategoriesResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;
    const result = await this.categoryRepository.findAll({ page, limit });
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
