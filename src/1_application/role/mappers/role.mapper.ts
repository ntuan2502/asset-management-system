import {
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';

type PrismaRoleWithPermissions = PrismaRole & {
  permissions?: PrismaPermission[];
};

export class RoleMapper {
  public static toDomain(prismaRole: PrismaRoleWithPermissions): RoleAggregate {
    const domainRole = new RoleAggregate();

    domainRole.id = prismaRole.id;
    domainRole.name = prismaRole.name;
    domainRole.description = prismaRole.description;
    domainRole.createdAt = prismaRole.createdAt;
    domainRole.updatedAt = prismaRole.updatedAt;
    domainRole.deletedAt = prismaRole.deletedAt;
    domainRole.permissionIds = prismaRole.permissions?.map((p) => p.id) ?? [];

    return domainRole;
  }
}
