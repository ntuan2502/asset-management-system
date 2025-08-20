import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OfficeType } from './office.type';
import { CreateOfficeInput } from 'src/1_application/office/dtos/create-office.input';
import { CreateOfficeCommand } from 'src/1_application/office/commands/impl/create-office.command';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';
import { OfficeConnection } from './office-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedOfficesResult } from 'src/1_application/office/queries/handlers/get-all-offices.handler';
import { GetAllOfficesQuery } from 'src/1_application/office/queries/impl/get-all-offices.query';
import { GetOfficeByIdQuery } from 'src/1_application/office/queries/impl/get-office-by-id.query';
import { UpdateOfficeInput } from 'src/1_application/office/dtos/update-office.input';
import { UpdateOfficeCommand } from 'src/1_application/office/commands/impl/update-office.command';
import { DeleteOfficeCommand } from 'src/1_application/office/commands/impl/delete-office.command';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';

@Resolver(() => OfficeType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class OfficeResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => OfficeType)
  @CheckPermissions({ action: ACTIONS.CREATE, subject: ENTITY_SUBJECTS.OFFICE })
  async createOffice(
    @Args('input') input: CreateOfficeInput,
  ): Promise<OfficeAggregate> {
    return this.commandBus.execute(new CreateOfficeCommand(input));
  }

  @Query(() => OfficeConnection, { name: 'offices' })
  @CheckPermissions({ action: ACTIONS.READ, subject: ENTITY_SUBJECTS.OFFICE })
  async getAllOffices(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedOfficesResult> {
    return this.queryBus.execute(new GetAllOfficesQuery(args));
  }

  @Query(() => OfficeType, { name: 'office', nullable: true })
  @CheckPermissions({ action: ACTIONS.READ, subject: ENTITY_SUBJECTS.OFFICE })
  async getOfficeById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<OfficeAggregate | null> {
    return this.queryBus.execute(new GetOfficeByIdQuery(id));
  }

  @Mutation(() => OfficeType)
  @CheckPermissions({ action: ACTIONS.UPDATE, subject: ENTITY_SUBJECTS.OFFICE })
  async updateOffice(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateOfficeInput,
  ): Promise<OfficeAggregate> {
    return this.commandBus.execute(new UpdateOfficeCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({ action: ACTIONS.DELETE, subject: ENTITY_SUBJECTS.OFFICE })
  async deleteOffice(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteOfficeCommand(id));
    return true;
  }
}
