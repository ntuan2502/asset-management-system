import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductResolver } from 'src/0_presentation/graphql/resolvers/product/product.resolver';
import { CreateProductHandler } from 'src/1_application/product/commands/handlers/create-product.handler';
import { PRODUCT_REPOSITORY } from './repositories/product.repository.interface';
import { PrismaProductRepository } from 'src/3_infrastructure/persistence/prisma/repositories/product/prisma-product.repository';
import { ProductProjector } from 'src/3_infrastructure/projection/product.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { UpdateProductHandler } from 'src/1_application/product/commands/handlers/update-product.handler';
import { ProductAggregateRepository } from './repositories/product-aggregate.repository';
import { GetAllProductsHandler } from 'src/1_application/product/queries/handlers/get-all-products.handler';
import { GetProductByIdHandler } from 'src/1_application/product/queries/handlers/get-product-by-id.handler';
import { DeleteProductHandler } from 'src/1_application/product/commands/handlers/delete-product.handler';
import { RestoreProductHandler } from 'src/1_application/product/commands/handlers/restore-product.handler';
import { CategoryModule } from '../category/category.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  RestoreProductHandler,
];
const QueryHandlers = [GetAllProductsHandler, GetProductByIdHandler];
const Repositories = [
  { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
  ProductAggregateRepository,
];
const Projectors = [ProductProjector];

@Module({
  imports: [
    CqrsModule,
    SharedInfrastructureModule,
    CategoryModule,
    ManufacturerModule,
  ],
  providers: [
    ProductResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
