import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PermissionResolver } from 'src/0_presentation/graphql/resolvers/permission/permission.resolver';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { GetAllPermissionsHandler } from 'src/1_application/permission/queries/handlers/get-all-permissions.handler';
import { PrismaPermissionRepository } from 'src/3_infrastructure/persistence/prisma/repositories/permission/prisma-permission.repository';
import { PERMISSION_REPOSITORY } from './repositories/permission.repository.interface';
import { GetPermissionsByIdsHandler } from 'src/1_application/permission/queries/handlers/get-permissions-by-ids.handler';

const QueryHandlers = [GetAllPermissionsHandler, GetPermissionsByIdsHandler];
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
