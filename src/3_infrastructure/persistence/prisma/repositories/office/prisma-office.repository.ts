import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { IOfficeRepository } from 'src/2_domain/office/repositories/office.repository.interface';
import { OfficeMapper } from 'src/1_application/office/mappers/office.mapper';
import { PaginatedOffices } from 'src/2_domain/office/repositories/office.repository.interface';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';

@Injectable()
export class PrismaOfficeRepository implements IOfficeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isDuplicate(data: {
    internationalName: string;
    shortName: string;
    taxCode: string;
  }): Promise<boolean> {
    const count = await this.prisma.office.count({
      where: {
        OR: [
          { internationalName: data.internationalName },
          { shortName: data.shortName },
          { taxCode: data.taxCode },
        ],
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findById(id: string): Promise<OfficeAggregate | null> {
    const office = await this.prisma.office.findFirst({
      where: { id, deletedAt: null },
    });
    return office ? OfficeMapper.toDomain(office) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedOffices> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [offices, totalCount] = await this.prisma.$transaction([
      this.prisma.office.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.office.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: offices.map((office) => OfficeMapper.toDomain(office)),
      meta: { totalCount, page, limit },
    };
  }
}
