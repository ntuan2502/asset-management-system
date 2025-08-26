import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { ProductType } from './product.type';
import { CreateProductInput } from 'src/1_application/product/dtos/create-product.input';
import { CreateProductCommand } from 'src/1_application/product/commands/impl/create-product.command';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { UpdateProductInput } from 'src/1_application/product/dtos/update-product.input';
import { UpdateProductCommand } from 'src/1_application/product/commands/impl/update-product.command';
import { DeleteProductCommand } from 'src/1_application/product/commands/impl/delete-product.command';
import { RestoreProductCommand } from 'src/1_application/product/commands/impl/restore-product.command';
import { ProductConnection } from './product-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedProductsResult } from 'src/1_application/product/queries/handlers/get-all-products.handler';
import { GetAllProductsQuery } from 'src/1_application/product/queries/impl/get-all-products.query';
import { GetProductByIdQuery } from 'src/1_application/product/queries/impl/get-product-by-id.query';
import { CategoryType } from '../category/category.type';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import { GetCategoryByIdQuery } from 'src/1_application/category/queries/impl/get-category-by-id.query';
import { ManufacturerType } from '../manufacturer/manufacturer.type';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import { GetManufacturerByIdQuery } from 'src/1_application/manufacturer/queries/impl/get-manufacturer-by-id.query';

@Resolver(() => ProductType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class ProductResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => ProductType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<ProductAggregate> {
    return this.commandBus.execute(new CreateProductCommand(input));
  }

  @Query(() => ProductConnection, { name: 'products' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async getAllProducts(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedProductsResult> {
    return this.queryBus.execute(new GetAllProductsQuery(args));
  }

  @Query(() => ProductType, { name: 'product', nullable: true })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async getProductById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ProductAggregate | null> {
    return this.queryBus.execute(new GetProductByIdQuery(id));
  }

  @Mutation(() => ProductType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductAggregate> {
    return this.commandBus.execute(new UpdateProductCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async deleteProduct(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteProductCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.RESTORE,
    subject: ENTITY_SUBJECTS.PRODUCT,
  })
  async restoreProduct(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreProductCommand(id));
    return true;
  }

  @ResolveField('category', () => CategoryType)
  async getCategory(
    @Parent() product: ProductAggregate,
  ): Promise<CategoryAggregate | null> {
    const categoryId = product.categoryId;
    return this.queryBus.execute(new GetCategoryByIdQuery(categoryId));
  }

  @ResolveField('manufacturer', () => ManufacturerType)
  async getManufacturer(
    @Parent() product: ProductAggregate,
  ): Promise<ManufacturerAggregate | null> {
    const manufacturerId = product.manufacturerId;
    return this.queryBus.execute(new GetManufacturerByIdQuery(manufacturerId));
  }
}
