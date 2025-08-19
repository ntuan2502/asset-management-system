import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StatusLabelResolver } from 'src/0_presentation/graphql/resolvers/status-label/status-label.resolver';
import { CreateStatusLabelHandler } from 'src/1_application/status-label/commands/handlers/create-status-label.handler';
import { STATUS_LABEL_REPOSITORY } from './repositories/status-label.repository.interface';
import { PrismaStatusLabelRepository } from 'src/3_infrastructure/persistence/prisma/repositories/status-label/prisma-status-label.repository';
import { StatusLabelProjector } from 'src/3_infrastructure/projection/status-label.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { GetAllStatusLabelsHandler } from 'src/1_application/status-label/queries/handlers/get-all-status-labels.handler';
import { GetStatusLabelByIdHandler } from 'src/1_application/status-label/queries/handlers/get-status-label-by-id.handler';
import { StatusLabelAggregateRepository } from './repositories/status-label-aggregate.repository';
import { UpdateStatusLabelHandler } from 'src/1_application/status-label/commands/handlers/update-status-label.handler';
import { DeleteStatusLabelHandler } from 'src/1_application/status-label/commands/handlers/delete-status-label.handler';
import { RestoreStatusLabelHandler } from 'src/1_application/status-label/commands/handlers/restore-status-label.handler';

const CommandHandlers = [
  CreateStatusLabelHandler,
  UpdateStatusLabelHandler,
  DeleteStatusLabelHandler,
  RestoreStatusLabelHandler,
];
const QueryHandlers = [GetAllStatusLabelsHandler, GetStatusLabelByIdHandler];
const Repositories = [
  { provide: STATUS_LABEL_REPOSITORY, useClass: PrismaStatusLabelRepository },
  StatusLabelAggregateRepository,
];
const Projectors = [StatusLabelProjector];

@Module({
  imports: [CqrsModule, SharedInfrastructureModule],
  providers: [
    StatusLabelResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [STATUS_LABEL_REPOSITORY],
})
export class StatusLabelModule {}
