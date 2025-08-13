import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DepartmentResolver } from 'src/0_presentation/graphql/resolvers/department/department.resolver';
import { CreateDepartmentHandler } from 'src/1_application/department/commands/handlers/create-department.handler';
import { DEPARTMENT_REPOSITORY } from './repositories/department.repository.interface';
import { PrismaDepartmentRepository } from 'src/3_infrastructure/persistence/prisma/repositories/department/prisma-department.repository';
import { DepartmentProjector } from 'src/3_infrastructure/projection/department.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { OfficeModule } from 'src/2_domain/office/office.module';
import { UpdateDepartmentHandler } from 'src/1_application/department/commands/handlers/update-department.handler';
import { DepartmentAggregateRepository } from './repositories/department-aggregate.repository';
import { GetAllDepartmentsHandler } from 'src/1_application/department/queries/handlers/get-all-departments.handler';
import { GetDepartmentByIdHandler } from 'src/1_application/department/queries/handlers/get-department-by-id.handler';
import { DeleteDepartmentHandler } from 'src/1_application/department/commands/handlers/delete-department.handler';
import { RestoreDepartmentHandler } from 'src/1_application/department/commands/handlers/restore-department.handler';

const CommandHandlers = [
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
  RestoreDepartmentHandler,
];
const QueryHandlers = [GetAllDepartmentsHandler, GetDepartmentByIdHandler];
const Repositories = [
  { provide: DEPARTMENT_REPOSITORY, useClass: PrismaDepartmentRepository },
  DepartmentAggregateRepository,
];
const Projectors = [DepartmentProjector];

@Module({
  imports: [CqrsModule, SharedInfrastructureModule, OfficeModule],
  providers: [
    DepartmentResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [DEPARTMENT_REPOSITORY],
})
export class DepartmentModule {}
