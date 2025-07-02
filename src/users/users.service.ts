import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PaginatedUsers } from './dto/paginated-users.response.ts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateUserInput): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findAllPaginated(page: number, limit: number): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
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

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id); // để kiểm tra tồn tại

    // Nếu cập nhật email, kiểm tra email mới có bị trùng không
    if (input.email && input.email !== user.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (emailTaken) {
        throw new ConflictException('Email already in use by another user');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id); // kiểm tra tồn tại
    return this.prisma.user.delete({ where: { id } });
  }
}
