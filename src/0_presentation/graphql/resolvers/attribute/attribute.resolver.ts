import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { AttributeType } from './attribute.type';
import { CreateAttributeInput } from 'src/1_application/attribute/dtos/create-attribute.input';
import { CreateAttributeCommand } from 'src/1_application/attribute/commands/impl/create-attribute.command';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { AttributeConnection } from './attribute-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedAttributesResult } from 'src/1_application/attribute/queries/handlers/get-all-attributes.handler';
import { GetAllAttributesQuery } from 'src/1_application/attribute/queries/impl/get-all-attributes.query';
import { GetAttributeByIdQuery } from 'src/1_application/attribute/queries/impl/get-attribute-by-id.query';
import { UpdateAttributeInput } from 'src/1_application/attribute/dtos/update-attribute.input';
import { UpdateAttributeCommand } from 'src/1_application/attribute/commands/impl/update-attribute.command';
import { DeleteAttributeCommand } from 'src/1_application/attribute/commands/impl/delete-attribute.command';
import { RestoreAttributeCommand } from 'src/1_application/attribute/commands/impl/restore-attribute.command';

@Resolver(() => AttributeType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class AttributeResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => AttributeType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async createAttribute(
    @Args('input') input: CreateAttributeInput,
  ): Promise<AttributeAggregate> {
    return this.commandBus.execute(new CreateAttributeCommand(input));
  }

  @Query(() => AttributeConnection, { name: 'attributes' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async getAllAttributes(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedAttributesResult> {
    return this.queryBus.execute(new GetAllAttributesQuery(args));
  }

  @Query(() => AttributeType, { name: 'attribute', nullable: true })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async getAttributeById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<AttributeAggregate | null> {
    return this.queryBus.execute(new GetAttributeByIdQuery(id));
  }

  @Mutation(() => AttributeType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async updateAttribute(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAttributeInput,
  ): Promise<AttributeAggregate> {
    return this.commandBus.execute(new UpdateAttributeCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async deleteAttribute(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteAttributeCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.RESTORE,
    subject: ENTITY_SUBJECTS.ATTRIBUTE,
  })
  async restoreAttribute(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreAttributeCommand(id));
    return true;
  }
}
