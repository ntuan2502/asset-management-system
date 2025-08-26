import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductByIdQuery } from '../impl/get-product-by-id.query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from 'src/2_domain/product/repositories/product.repository.interface';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler
  implements IQueryHandler<GetProductByIdQuery, ProductAggregate | null>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<ProductAggregate | null> {
    return this.productRepository.findById(query.id);
  }
}
