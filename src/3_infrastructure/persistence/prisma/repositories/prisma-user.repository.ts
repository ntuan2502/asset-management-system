import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/2_domain/user/repositories/user.repository.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { PrismaService } from '../prisma.service';
import { UserMapper } from 'src/1_application/user/mappers/user.mapper'; // << IMPORT MAPPER

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserAggregate): Promise<UserAggregate> {
    const createdPrismaUser = await this.prisma.user.create({
      data: user,
    });
    return UserMapper.toDomain(createdPrismaUser); // << SỬ DỤNG MAPPER
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null; // << SỬ DỤNG MAPPER
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const prismaUser = await this.prisma.user.findUnique({ where: { email } });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null; // << SỬ DỤNG MAPPER
  }

  // --- THÊM MỚI ---
  async findAll(): Promise<UserAggregate[]> {
    const prismaUsers = await this.prisma.user.findMany();
    // Dùng mapper để chuyển đổi một mảng các đối tượng Prisma thành mảng Aggregate
    return prismaUsers.map((prismaUser) => UserMapper.toDomain(prismaUser));
  }
}
