import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCategoryByIdQuery } from '../impl/get-category-by-id.query';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from 'src/2_domain/category/repositories/category.repository.interface';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler
  implements IQueryHandler<GetCategoryByIdQuery, CategoryAggregate | null>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    query: GetCategoryByIdQuery,
  ): Promise<CategoryAggregate | null> {
    return this.categoryRepository.findById(query.id);
  }
}
