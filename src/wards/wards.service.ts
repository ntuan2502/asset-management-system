import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return this.prisma.ward.findMany({
      include: {
        province: true,
      },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.ward.findMany({
        skip,
        take: limit,
        include: {
          province: true,
        },
      }),
      this.prisma.ward.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findOne(id: string) {
    const ward = await this.prisma.ward.findUnique({
      where: { id },
      include: {
        province: true,
      },
    });

    if (!ward) {
      throw new NotFoundException(`Ward with id "${id}" not found`);
    }

    return ward;
  }
}
