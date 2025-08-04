import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PermissionType } from './permission.type';
import { Permission } from '@prisma/client';

@Resolver(() => PermissionType)
export class PermissionResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [PermissionType], { name: 'permissions' })
  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }
}
