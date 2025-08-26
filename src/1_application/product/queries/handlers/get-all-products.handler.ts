import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllProductsQuery } from '../impl/get-all-products.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from 'src/2_domain/product/repositories/product.repository.interface';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from 'src/shared/constants/pagination.constants';

export type PaginatedProductsResult = {
  nodes: ProductAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler
  implements IQueryHandler<GetAllProductsQuery, PaginatedProductsResult>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetAllProductsQuery): Promise<PaginatedProductsResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;

    const result = await this.productRepository.findAll({ page, limit });

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
