import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Presentation
import { RoleResolver } from 'src/0_presentation/graphql/resolvers/role/role.resolver';

// Application
import { CreateRoleHandler } from 'src/1_application/role/commands/handlers/create-role.handler';
import { AssignPermissionsToRoleHandler } from 'src/1_application/role/commands/handlers/assign-permissions-to-role.handler';
import { GetAllRolesHandler } from 'src/1_application/role/queries/handlers/get-all-roles.handler';
import { GetRoleByIdHandler } from 'src/1_application/role/queries/handlers/get-role-by-id.handler';

// Domain
import { ROLE_REPOSITORY } from './repositories/role.repository.interface';
import { RoleAggregateRepository } from './repositories/role-aggregate.repository';

// Infrastructure
import { PrismaRoleRepository } from 'src/3_infrastructure/persistence/prisma/repositories/role/prisma-role.repository';
import { RoleProjector } from 'src/3_infrastructure/projection/role.projector';

// Shared Modules
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { PrismaModule } from 'src/3_infrastructure/persistence/prisma/prisma.module';

const CommandHandlers = [CreateRoleHandler, AssignPermissionsToRoleHandler];
const QueryHandlers = [GetAllRolesHandler, GetRoleByIdHandler];
const Repositories = [
  { provide: ROLE_REPOSITORY, useClass: PrismaRoleRepository },
  RoleAggregateRepository,
];
const Projectors = [RoleProjector];

@Module({
  imports: [PrismaModule, CqrsModule, SharedInfrastructureModule],
  providers: [
    RoleResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [ROLE_REPOSITORY],
})
export class RoleModule {}
