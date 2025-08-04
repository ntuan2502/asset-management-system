import { Module } from '@nestjs/common';
import { PermissionResolver } from 'src/0_presentation/graphql/resolvers/permission/permission.resolver';

@Module({
  providers: [PermissionResolver],
})
export class PermissionModule {}
