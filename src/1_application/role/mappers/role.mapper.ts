import { Role as PrismaRole } from '@prisma/client';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';

export class RoleMapper {
  public static toDomain(prismaRole: PrismaRole): RoleAggregate {
    const domainRole = new RoleAggregate();

    domainRole.id = prismaRole.id;
    domainRole.name = prismaRole.name;
    domainRole.description = prismaRole.description;

    return domainRole;
  }
}
