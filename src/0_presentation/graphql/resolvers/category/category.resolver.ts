import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';

import { CategoryType } from './category.type';
import { CreateCategoryInput } from 'src/1_application/category/dtos/create-category.input';
import { CreateCategoryCommand } from 'src/1_application/category/commands/impl/create-category.command';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { CategoryConnection } from './category-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { GetAllCategoriesQuery } from 'src/1_application/category/queries/impl/get-all-categories.query';
import { GetCategoryByIdQuery } from 'src/1_application/category/queries/impl/get-category-by-id.query';
import { PaginatedCategoriesResult } from 'src/1_application/category/queries/handlers/get-all-categories.handler';
import { UpdateCategoryInput } from 'src/1_application/category/dtos/update-category.input';
import { UpdateCategoryCommand } from 'src/1_application/category/commands/impl/update-category.command';
import { DeleteCategoryCommand } from 'src/1_application/category/commands/impl/delete-category.command';
import { RestoreCategoryCommand } from 'src/1_application/category/commands/impl/restore-category.command';

@Resolver(() => CategoryType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class CategoryResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => CategoryType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.CATEGORY,
  })
  async createCategory(
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryAggregate> {
    return this.commandBus.execute(new CreateCategoryCommand(input));
  }

  @Query(() => CategoryConnection, { name: 'Categories' })
  @CheckPermissions({ action: ACTIONS.READ, subject: ENTITY_SUBJECTS.CATEGORY })
  async getAllCategories(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedCategoriesResult> {
    return this.queryBus.execute(new GetAllCategoriesQuery(args));
  }

  @Query(() => CategoryType, { name: 'Category', nullable: true })
  @CheckPermissions({ action: ACTIONS.READ, subject: ENTITY_SUBJECTS.CATEGORY })
  async getCategoryById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CategoryAggregate | null> {
    return this.queryBus.execute(new GetCategoryByIdQuery(id));
  }

  @Mutation(() => CategoryType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.CATEGORY,
  })
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<CategoryAggregate> {
    return this.commandBus.execute(new UpdateCategoryCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.CATEGORY,
  })
  async deleteCategory(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteCategoryCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.RESTORE,
    subject: ENTITY_SUBJECTS.CATEGORY,
  })
  async restoreCategory(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreCategoryCommand(id));
    return true;
  }
}
