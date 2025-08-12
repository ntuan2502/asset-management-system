import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RoleResolver } from 'src/0_presentation/graphql/resolvers/role/role.resolver';

import { CreateRoleHandler } from 'src/1_application/role/commands/handlers/create-role.handler';
import { UpdateRoleHandler } from 'src/1_application/role/commands/handlers/update-role.handler';
import { DeleteRoleHandler } from 'src/1_application/role/commands/handlers/delete-role.handler';
import { AssignPermissionsToRoleHandler } from 'src/1_application/role/commands/handlers/assign-permissions-to-role.handler';
import { GetAllRolesHandler } from 'src/1_application/role/queries/handlers/get-all-roles.handler';
import { GetRoleByIdHandler } from 'src/1_application/role/queries/handlers/get-role-by-id.handler';

import { ROLE_REPOSITORY } from './repositories/role.repository.interface';
import { RoleAggregateRepository } from './repositories/role-aggregate.repository';

import { PrismaRoleRepository } from 'src/3_infrastructure/persistence/prisma/repositories/role/prisma-role.repository';
import { RoleProjector } from 'src/3_infrastructure/projection/role.projector';

import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { PrismaModule } from 'src/3_infrastructure/persistence/prisma/prisma.module';
import { RestoreRoleHandler } from 'src/1_application/role/commands/handlers/restore-role.handler';

const CommandHandlers = [
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  RestoreRoleHandler,
  AssignPermissionsToRoleHandler,
];
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
