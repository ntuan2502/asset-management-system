import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IAttributeRepository,
  PaginatedAttributes,
} from 'src/2_domain/attribute/repositories/attribute.repository.interface';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import { AttributeMapper } from 'src/1_application/attribute/mappers/attribute.mapper';

@Injectable()
export class PrismaAttributeRepository implements IAttributeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<AttributeAggregate | null> {
    const attribute = await this.prisma.attribute.findFirst({
      where: { name, deletedAt: null },
    });
    return attribute ? AttributeMapper.toDomain(attribute) : null;
  }

  async findById(id: string): Promise<AttributeAggregate | null> {
    const attribute = await this.prisma.attribute.findFirst({
      where: { id, deletedAt: null },
    });
    return attribute ? AttributeMapper.toDomain(attribute) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedAttributes> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [attributes, totalCount] = await this.prisma.$transaction([
      this.prisma.attribute.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.attribute.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: attributes.map((attr) => AttributeMapper.toDomain(attr)),
      meta: { totalCount, page, limit },
    };
  }
}
