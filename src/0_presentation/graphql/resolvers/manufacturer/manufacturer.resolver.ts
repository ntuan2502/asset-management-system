import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';

import { ManufacturerType } from './manufacturer.type';
import { CreateManufacturerInput } from 'src/1_application/manufacturer/dtos/create-manufacturer.input';
import { CreateManufacturerCommand } from 'src/1_application/manufacturer/commands/impl/create-manufacturer.command';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { ManufacturerConnection } from './manufacturer-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { GetAllManufacturersQuery } from 'src/1_application/manufacturer/queries/impl/get-all-manufacturers.query';
import { GetManufacturerByIdQuery } from 'src/1_application/manufacturer/queries/impl/get-manufacturer-by-id.query';
import { PaginatedManufacturersResult } from 'src/1_application/manufacturer/queries/handlers/get-all-manufacturers.handler';
import { UpdateManufacturerInput } from 'src/1_application/manufacturer/dtos/update-manufacturer.input';
import { UpdateManufacturerCommand } from 'src/1_application/manufacturer/commands/impl/update-manufacturer.command';
import { DeleteManufacturerCommand } from 'src/1_application/manufacturer/commands/impl/delete-manufacturer.command';

@Resolver(() => ManufacturerType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class ManufacturerResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => ManufacturerType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.MANUFACTURER,
  })
  async createManufacturer(
    @Args('input') input: CreateManufacturerInput,
  ): Promise<ManufacturerAggregate> {
    return this.commandBus.execute(new CreateManufacturerCommand(input));
  }

  @Query(() => ManufacturerConnection, { name: 'Manufacturers' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.MANUFACTURER,
  })
  async getAllManufacturers(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedManufacturersResult> {
    return this.queryBus.execute(new GetAllManufacturersQuery(args));
  }

  @Query(() => ManufacturerType, { name: 'Manufacturer', nullable: true })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.MANUFACTURER,
  })
  async getManufacturerById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ManufacturerAggregate | null> {
    return this.queryBus.execute(new GetManufacturerByIdQuery(id));
  }

  @Mutation(() => ManufacturerType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.MANUFACTURER,
  })
  async updateManufacturer(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateManufacturerInput,
  ): Promise<ManufacturerAggregate> {
    return this.commandBus.execute(new UpdateManufacturerCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.MANUFACTURER,
  })
  async deleteManufacturer(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteManufacturerCommand(id));
    return true;
  }
}
