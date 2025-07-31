import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from 'src/0_presentation/graphql/resolvers/user/user.resolver';
import { CreateUserHandler } from 'src/1_application/user/commands/handlers/create-user.handler';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PrismaUserRepository } from 'src/3_infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { GetUserByIdHandler } from 'src/1_application/user/queries/handlers/get-user-by-id.handler'; // << IMPORT
import { GetAllUsersHandler } from 'src/1_application/user/queries/handlers/get-all-users.handler';
import { DeleteUserHandler } from 'src/1_application/user/commands/handlers/delete-user.handler';
import { UserProjector } from 'src/3_infrastructure/projection/user.projector';
import { EventStoreModule } from 'src/3_infrastructure/event-store/event-store.module'; // << IMPORT

const commandHandlers = [
  CreateUserHandler,
  DeleteUserHandler, // << THÊM VÀO ĐÂY
];
const queryHandlers = [
  GetUserByIdHandler,
  GetAllUsersHandler, // << THÊM HANDLER VÀO ĐÂY
];
const repositories = [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
];
const projectors = [UserProjector]; // << TẠO MỘT MẢNG CHO RÕ RÀNG

@Module({
  imports: [CqrsModule, EventStoreModule],
  providers: [
    UserResolver,
    PrismaService,
    ...commandHandlers,
    ...queryHandlers, // << ĐĂNG KÝ
    ...repositories,
    ...projectors, // << ĐĂNG KÝ VÀO ĐÂY
  ],
})
export class UserModule {}
