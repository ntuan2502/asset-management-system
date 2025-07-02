import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return this.prisma.province.findMany({
      include: {
        wards: true,
      },
    });
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.province.findMany({
        skip,
        take: limit,
        include: {
          wards: true,
        },
      }),
      this.prisma.province.count(),
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
    const province = await this.prisma.province.findUnique({
      where: { id },
      include: {
        wards: true,
      },
    });

    if (!province) {
      throw new NotFoundException(`Province with id "${id}" not found`);
    }

    return province;
  }
}
