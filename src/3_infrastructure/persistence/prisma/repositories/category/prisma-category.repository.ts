import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  ICategoryRepository,
  PaginatedCategories,
} from 'src/2_domain/category/repositories/category.repository.interface';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import { CategoryMapper } from 'src/1_application/category/mappers/category.mapper';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<CategoryAggregate | null> {
    const category = await this.prisma.category.findFirst({
      where: { name, deletedAt: null },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findById(id: string): Promise<CategoryAggregate | null> {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedCategories> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [categories, totalCount] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: categories.map((category) => CategoryMapper.toDomain(category)),
      meta: { totalCount, page, limit },
    };
  }
}
