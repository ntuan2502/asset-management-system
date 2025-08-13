import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IDepartmentRepository,
  PaginatedDepartments,
} from 'src/2_domain/department/repositories/department.repository.interface';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';
import { DepartmentMapper } from 'src/1_application/department/mappers/department.mapper';

@Injectable()
export class PrismaDepartmentRepository implements IDepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async doesNameExistInOffice(
    name: string,
    officeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: {
        name: name,
        officeId: officeId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findById(id: string): Promise<DepartmentAggregate | null> {
    const department = await this.prisma.department.findFirst({
      where: { id, deletedAt: null },
    });
    return department ? DepartmentMapper.toDomain(department) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedDepartments> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [departments, totalCount] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.department.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: departments.map((department) =>
        DepartmentMapper.toDomain(department),
      ),
      meta: { totalCount, page, limit },
    };
  }
}
