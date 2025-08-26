import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  IProductRepository,
  PaginatedProducts,
} from 'src/2_domain/product/repositories/product.repository.interface';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';
import { ProductMapper } from 'src/1_application/product/mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<ProductAggregate | null> {
    const product = await this.prisma.product.findFirst({
      where: { name, deletedAt: null },
    });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findById(id: string): Promise<ProductAggregate | null> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
    return product ? ProductMapper.toDomain(product) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedProducts> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [products, totalCount] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: products.map((product) => ProductMapper.toDomain(product)),
      meta: { totalCount, page, limit },
    };
  }
}
