import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryResolver } from 'src/0_presentation/graphql/resolvers/category/category.resolver';
import { CreateCategoryHandler } from 'src/1_application/category/commands/handlers/create-category.handler';
import { CATEGORY_REPOSITORY } from './repositories/category.repository.interface';
import { PrismaCategoryRepository } from 'src/3_infrastructure/persistence/prisma/repositories/category/prisma-category.repository';
import { CategoryProjector } from 'src/3_infrastructure/projection/category.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { GetAllCategoriesHandler } from 'src/1_application/category/queries/handlers/get-all-categories.handler';
import { GetCategoryByIdHandler } from 'src/1_application/category/queries/handlers/get-category-by-id.handler';
import { CategoryAggregateRepository } from './repositories/category-aggregate.repository';
import { UpdateCategoryHandler } from 'src/1_application/category/commands/handlers/update-category.handler';
import { DeleteCategoryHandler } from 'src/1_application/category/commands/handlers/delete-category.handler';
import { RestoreCategoryHandler } from 'src/1_application/category/commands/handlers/restore-category.handler';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
  RestoreCategoryHandler,
];
const QueryHandlers = [GetAllCategoriesHandler, GetCategoryByIdHandler];
const Repositories = [
  { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
  CategoryAggregateRepository,
];
const Projectors = [CategoryProjector];

@Module({
  imports: [CqrsModule, SharedInfrastructureModule],
  providers: [
    CategoryResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
