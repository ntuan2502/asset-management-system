import { Injectable } from '@nestjs/common';
import {
  IPermissionRepository,
  PaginatedPermissions,
} from 'src/2_domain/permission/repositories/permission.repository.interface';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { PermissionMapper } from 'src/1_application/permission/mappers/permission.mapper';
import { PermissionAggregate } from 'src/2_domain/permission/aggregates/permission.aggregate';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedPermissions> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [permissions, totalCount] = await this.prisma.$transaction([
      this.prisma.permission.findMany({
        skip,
        take: limit,
        orderBy: [{ subject: 'asc' }, { action: 'asc' }],
      }),
      this.prisma.permission.count(),
    ]);

    return {
      nodes: permissions.map((p) => PermissionMapper.toDomain(p)),
      meta: { totalCount, page, limit },
    };
  }

  async findByIds(ids: string[]): Promise<PermissionAggregate[]> {
    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: ids } },
    });
    return permissions.map((p) => PermissionMapper.toDomain(p));
  }
}
