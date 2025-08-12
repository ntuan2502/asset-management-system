import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs'; // << IMPORT
import { PermissionResolver } from 'src/0_presentation/graphql/resolvers/permission/permission.resolver';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { GetAllPermissionsHandler } from 'src/1_application/permission/queries/handlers/get-all-permissions.handler'; // << IMPORT
import { PrismaPermissionRepository } from 'src/3_infrastructure/persistence/prisma/repositories/permission/prisma-permission.repository'; // << IMPORT
import { PERMISSION_REPOSITORY } from './repositories/permission.repository.interface'; // << IMPORT

const QueryHandlers = [GetAllPermissionsHandler];
const Repositories = [
  { provide: PERMISSION_REPOSITORY, useClass: PrismaPermissionRepository },
];

@Module({
  imports: [CqrsModule],
  providers: [
    PermissionResolver,
    PrismaService,
    ...QueryHandlers,
    ...Repositories,
  ],
})
export class PermissionModule {}
