import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ManufacturerResolver } from 'src/0_presentation/graphql/resolvers/manufacturer/manufacturer.resolver';
import { CreateManufacturerHandler } from 'src/1_application/manufacturer/commands/handlers/create-manufacturer.handler';
import { MANUFACTURER_REPOSITORY } from './repositories/manufacturer.repository.interface';
import { PrismaManufacturerRepository } from 'src/3_infrastructure/persistence/prisma/repositories/manufacturer/prisma-manufacturer.repository';
import { ManufacturerProjector } from 'src/3_infrastructure/projection/manufacturer.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { GetAllManufacturersHandler } from 'src/1_application/manufacturer/queries/handlers/get-all-manufacturers.handler';
import { GetManufacturerByIdHandler } from 'src/1_application/manufacturer/queries/handlers/get-manufacturer-by-id.handler';
import { ManufacturerAggregateRepository } from './repositories/manufacturer-aggregate.repository';
import { UpdateManufacturerHandler } from 'src/1_application/manufacturer/commands/handlers/update-manufacturer.handler';
import { DeleteManufacturerHandler } from 'src/1_application/manufacturer/commands/handlers/delete-manufacturer.handler';
import { RestoreManufacturerHandler } from 'src/1_application/manufacturer/commands/handlers/restore-manufacturer.handler';

const CommandHandlers = [
  CreateManufacturerHandler,
  UpdateManufacturerHandler,
  DeleteManufacturerHandler,
  RestoreManufacturerHandler,
];
const QueryHandlers = [GetAllManufacturersHandler, GetManufacturerByIdHandler];
const Repositories = [
  { provide: MANUFACTURER_REPOSITORY, useClass: PrismaManufacturerRepository },
  ManufacturerAggregateRepository,
];
const Projectors = [ManufacturerProjector];

@Module({
  imports: [CqrsModule, SharedInfrastructureModule],
  providers: [
    ManufacturerResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [MANUFACTURER_REPOSITORY],
})
export class ManufacturerModule {}
