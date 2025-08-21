import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';

import { StatusLabelType } from './status-label.type';
import { CreateStatusLabelInput } from 'src/1_application/status-label/dtos/create-status-label.input';
import { CreateStatusLabelCommand } from 'src/1_application/status-label/commands/impl/create-status-label.command';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { StatusLabelConnection } from './status-label-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { GetAllStatusLabelsQuery } from 'src/1_application/status-label/queries/impl/get-all-status-labels.query';
import { GetStatusLabelByIdQuery } from 'src/1_application/status-label/queries/impl/get-status-label-by-id.query';
import { PaginatedStatusLabelsResult } from 'src/1_application/status-label/queries/handlers/get-all-status-labels.handler';
import { UpdateStatusLabelInput } from 'src/1_application/status-label/dtos/update-status-label.input';
import { UpdateStatusLabelCommand } from 'src/1_application/status-label/commands/impl/update-status-label.command';
import { DeleteStatusLabelCommand } from 'src/1_application/status-label/commands/impl/delete-status-label.command';
import { RestoreStatusLabelCommand } from 'src/1_application/status-label/commands/impl/restore-status-label.command';

@Resolver(() => StatusLabelType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class StatusLabelResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => StatusLabelType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async createStatusLabel(
    @Args('input') input: CreateStatusLabelInput,
  ): Promise<StatusLabelAggregate> {
    return this.commandBus.execute(new CreateStatusLabelCommand(input));
  }

  @Query(() => StatusLabelConnection, { name: 'statusLabels' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async getAllStatusLabels(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedStatusLabelsResult> {
    return this.queryBus.execute(new GetAllStatusLabelsQuery(args));
  }

  @Query(() => StatusLabelType, { name: 'statusLabel', nullable: true })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async getStatusLabelById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<StatusLabelAggregate | null> {
    return this.queryBus.execute(new GetStatusLabelByIdQuery(id));
  }

  @Mutation(() => StatusLabelType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async updateStatusLabel(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateStatusLabelInput,
  ): Promise<StatusLabelAggregate> {
    return this.commandBus.execute(new UpdateStatusLabelCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async deleteStatusLabel(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteStatusLabelCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.RESTORE,
    subject: ENTITY_SUBJECTS.STATUS_LABEL,
  })
  async restoreStatusLabel(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreStatusLabelCommand(id));
    return true;
  }
}
