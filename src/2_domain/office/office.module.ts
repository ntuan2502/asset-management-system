import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OfficeResolver } from 'src/0_presentation/graphql/resolvers/office/office.resolver';
import { CreateOfficeHandler } from 'src/1_application/office/commands/handlers/create-office.handler';
import { OFFICE_REPOSITORY } from './repositories/office.repository.interface';
import { PrismaOfficeRepository } from 'src/3_infrastructure/persistence/prisma/repositories/office/prisma-office.repository';
import { OfficeProjector } from 'src/3_infrastructure/projection/office.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { GetAllOfficesHandler } from 'src/1_application/office/queries/handlers/get-all-offices.handler';
import { GetOfficeByIdHandler } from 'src/1_application/office/queries/handlers/get-office-by-id.handler';
import { OfficeAggregateRepository } from './repositories/office-aggregate.repository';
import { UpdateOfficeHandler } from 'src/1_application/office/commands/handlers/update-office.handler';
import { DeleteOfficeHandler } from 'src/1_application/office/commands/handlers/delete-office.handler';
import { RestoreOfficeHandler } from 'src/1_application/office/commands/handlers/restore-office.handler';

const CommandHandlers = [
  CreateOfficeHandler,
  UpdateOfficeHandler,
  DeleteOfficeHandler,
  RestoreOfficeHandler,
];
const QueryHandlers = [GetAllOfficesHandler, GetOfficeByIdHandler];
const Repositories = [
  { provide: OFFICE_REPOSITORY, useClass: PrismaOfficeRepository },
  OfficeAggregateRepository,
];
const Projectors = [OfficeProjector];

@Module({
  imports: [CqrsModule, SharedInfrastructureModule],
  providers: [
    OfficeResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [OFFICE_REPOSITORY],
})
export class OfficeModule {}
