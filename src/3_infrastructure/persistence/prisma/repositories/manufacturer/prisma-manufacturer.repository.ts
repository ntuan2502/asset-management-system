import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IManufacturerRepository,
  PaginatedCategories,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import { ManufacturerMapper } from 'src/1_application/manufacturer/mappers/manufacturer.mapper';

@Injectable()
export class PrismaManufacturerRepository implements IManufacturerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<ManufacturerAggregate | null> {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: { name, deletedAt: null },
    });
    return manufacturer ? ManufacturerMapper.toDomain(manufacturer) : null;
  }

  async findById(id: string): Promise<ManufacturerAggregate | null> {
    const manufacturer = await this.prisma.manufacturer.findFirst({
      where: { id, deletedAt: null },
    });
    return manufacturer ? ManufacturerMapper.toDomain(manufacturer) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedCategories> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [manufacturers, totalCount] = await this.prisma.$transaction([
      this.prisma.manufacturer.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.manufacturer.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: manufacturers.map((manufacturer) =>
        ManufacturerMapper.toDomain(manufacturer),
      ),
      meta: { totalCount, page, limit },
    };
  }
}
