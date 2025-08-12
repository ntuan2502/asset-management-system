import { Permission as PrismaPermission } from '@prisma/client';
import { PermissionAggregate } from 'src/2_domain/permission/aggregates/permission.aggregate';

export class PermissionMapper {
  public static toDomain(
    prismaPermission: PrismaPermission,
  ): PermissionAggregate {
    const domainPermission = new PermissionAggregate();
    domainPermission.id = prismaPermission.id;
    domainPermission.action = prismaPermission.action;
    domainPermission.subject = prismaPermission.subject;
    domainPermission.createdAt = prismaPermission.createdAt;
    domainPermission.updatedAt = prismaPermission.updatedAt;
    return domainPermission;
  }
}
