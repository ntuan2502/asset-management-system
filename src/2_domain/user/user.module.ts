import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from 'src/0_presentation/graphql/resolvers/user/user.resolver';
import { CreateUserHandler } from 'src/1_application/user/commands/handlers/create-user.handler';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PrismaUserRepository } from 'src/3_infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { GetUserByIdHandler } from 'src/1_application/user/queries/handlers/get-user-by-id.handler';
import { GetAllUsersHandler } from 'src/1_application/user/queries/handlers/get-all-users.handler';
import { DeleteUserHandler } from 'src/1_application/user/commands/handlers/delete-user.handler';
import { UserProjector } from 'src/3_infrastructure/projection/user.projector';
import { EventStoreModule } from 'src/3_infrastructure/event-store/event-store.module';
import { UpdateUserHandler } from 'src/1_application/user/commands/handlers/update-user.handler';
import { SnapshotStoreModule } from 'src/3_infrastructure/snapshot-store/snapshot-store.module';
import { AggregateRepository } from './repositories/aggregate.repository';
import { SnapshotterService } from 'src/3_infrastructure/snapshot-store/snapshotter.service';
import { RestoreUserHandler } from 'src/1_application/user/commands/handlers/restore-user.handler';

const commandHandlers = [
  CreateUserHandler,
  DeleteUserHandler,
  UpdateUserHandler,
  RestoreUserHandler,
];
const queryHandlers = [GetUserByIdHandler, GetAllUsersHandler];
const repositories = [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  AggregateRepository,
];
const projectors = [UserProjector];
const sagas = [SnapshotterService];

@Module({
  imports: [CqrsModule, EventStoreModule, SnapshotStoreModule],
  providers: [
    UserResolver,
    PrismaService,
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...projectors,
    ...sagas,
  ],
  exports: [...repositories],
})
export class UserModule {}
