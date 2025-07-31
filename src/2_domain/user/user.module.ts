import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from 'src/0_presentation/graphql/resolvers/user/user.resolver';
import { CreateUserHandler } from 'src/1_application/user/commands/handlers/create-user.handler';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PrismaUserRepository } from 'src/3_infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { GetUserByIdHandler } from 'src/1_application/user/queries/handlers/get-user-by-id.handler'; // << IMPORT
import { GetAllUsersHandler } from 'src/1_application/user/queries/handlers/get-all-users.handler';

const commandHandlers = [CreateUserHandler];
const queryHandlers = [GetUserByIdHandler, GetAllUsersHandler]; // << THÊM HANDLER VÀO ĐÂY
const repositories = [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
];

@Module({
  imports: [CqrsModule],
  providers: [
    UserResolver,
    PrismaService,
    ...commandHandlers,
    ...queryHandlers, // << ĐĂNG KÝ
    ...repositories,
  ],
})
export class UserModule {}
