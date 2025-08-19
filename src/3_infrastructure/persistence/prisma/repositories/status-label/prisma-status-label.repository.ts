import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IStatusLabelRepository,
  PaginatedStatusLabels,
} from 'src/2_domain/status-label/repositories/status-label.repository.interface';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
import { StatusLabelMapper } from 'src/1_application/status-label/mappers/status-label.mapper';

@Injectable()
export class PrismaStatusLabelRepository implements IStatusLabelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<StatusLabelAggregate | null> {
    const label = await this.prisma.statusLabel.findFirst({
      where: { name, deletedAt: null },
    });
    return label ? StatusLabelMapper.toDomain(label) : null;
  }

  async findById(id: string): Promise<StatusLabelAggregate | null> {
    const label = await this.prisma.statusLabel.findFirst({
      where: { id, deletedAt: null },
    });
    return label ? StatusLabelMapper.toDomain(label) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedStatusLabels> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [labels, totalCount] = await this.prisma.$transaction([
      this.prisma.statusLabel.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.statusLabel.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: labels.map((label) => StatusLabelMapper.toDomain(label)),
      meta: { totalCount, page, limit },
    };
  }
}
