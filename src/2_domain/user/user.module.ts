import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserResolver } from 'src/0_presentation/graphql/resolvers/user/user.resolver';

import { CreateUserHandler } from 'src/1_application/user/commands/handlers/create-user.handler';
import { DeleteUserHandler } from 'src/1_application/user/commands/handlers/delete-user.handler';
import { UpdateUserHandler } from 'src/1_application/user/commands/handlers/update-user.handler';
import { RestoreUserHandler } from 'src/1_application/user/commands/handlers/restore-user.handler';
import { AssignRoleToUserHandler } from 'src/1_application/user/commands/handlers/assign-role-to-user.handler';
import { GetAllUsersHandler } from 'src/1_application/user/queries/handlers/get-all-users.handler';
import { GetUserByIdHandler } from 'src/1_application/user/queries/handlers/get-user-by-id.handler';

import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { UserAggregateRepository } from './repositories/user-aggregate.repository';

import { PrismaUserRepository } from 'src/3_infrastructure/persistence/prisma/repositories/user/prisma-user.repository';
import { SnapshotterService } from 'src/3_infrastructure/snapshot-store/snapshotter.service';

import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { RoleModule } from 'src/2_domain/role/role.module';
import { PrismaModule } from 'src/3_infrastructure/persistence/prisma/prisma.module';
import { UserProjector } from 'src/3_infrastructure/projection/user.projector';
import { DepartmentModule } from '../department/department.module';
import { OfficeModule } from '../office/office.module';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  RestoreUserHandler,
  AssignRoleToUserHandler,
];
const Projectors = [UserProjector];
const QueryHandlers = [GetAllUsersHandler, GetUserByIdHandler];
const Repositories = [
  { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  UserAggregateRepository,
];
const Sagas = [SnapshotterService];

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    SharedInfrastructureModule,
    forwardRef(() => RoleModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => OfficeModule),
  ],
  providers: [
    UserResolver,
    ...CommandHandlers,
    ...Projectors,
    ...QueryHandlers,
    ...Repositories,
    ...Sagas,
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
