import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IRoleRepository,
  PaginatedRoles,
  RoleWithPermissions,
} from 'src/2_domain/role/repositories/role.repository.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { RoleMapper } from 'src/1_application/role/mappers/role.mapper';
import { PermissionMapper } from 'src/1_application/permission/mappers/permission.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<RoleAggregate | null> {
    const role = await this.prisma.role.findFirst({
      where: { name, deletedAt: null },
      include: { permissions: true },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findById(id: string): Promise<RoleAggregate | null> {
    const role = await this.prisma.role.findUnique({
      where: { id, deletedAt: null },
      include: { permissions: true },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByIds(ids: string[]): Promise<RoleAggregate[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      include: { permissions: true },
    });
    return roles.map((role) => RoleMapper.toDomain(role));
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedRoles> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [roles, totalCount] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where: { deletedAt: null },
        include: { permissions: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.role.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: roles.map((role) => RoleMapper.toDomain(role)),
      meta: { totalCount, page, limit },
    };
  }

  async findByIdWithPermissions(
    id: string,
  ): Promise<RoleWithPermissions | null> {
    const role = await this.prisma.role.findUnique({
      where: { id, deletedAt: null },
      include: { permissions: true },
    });
    if (!role) return null;

    const aggregate = RoleMapper.toDomain(role);
    (aggregate as RoleWithPermissions).permissions = role.permissions.map((p) =>
      PermissionMapper.toDomain(p),
    );

    return aggregate as RoleWithPermissions;
  }
}
