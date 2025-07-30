import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserResolver } from 'src/0_presentation/graphql/resolvers/user/user.resolver';
import { CreateUserHandler } from 'src/1_application/user/commands/handlers/create-user.handler';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PrismaUserRepository } from 'src/3_infrastructure/persistence/prisma/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

const commandHandlers = [CreateUserHandler];
const queryHandlers = []; // Sẽ thêm sau
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
    ...queryHandlers,
    ...repositories,
  ],
  exports: [],
})
export class UserModule {}
