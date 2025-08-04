import { Role as PrismaRole } from '@prisma/client';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';

export class RoleMapper {
  public static toDomain(prismaRole: PrismaRole): RoleAggregate {
    const domainRole = new RoleAggregate();

    // Tạm thời chỉ gán các thuộc tính cơ bản
    // Sau này khi có permission, chúng ta sẽ cần map cả permissionIds
    domainRole.id = prismaRole.id;
    domainRole.name = prismaRole.name;
    domainRole.description = prismaRole.description;

    // Chúng ta không map version từ Read Model
    return domainRole;
  }
}
