import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  UserWithPermissions,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { PrismaService } from '../prisma.service';
import { UserMapper } from 'src/1_application/user/mappers/user.mapper'; // << IMPORT MAPPER

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserAggregate): Promise<UserAggregate> {
    const prismaUserData = UserMapper.toPersistence(user);

    const createdPrismaUser = await this.prisma.user.create({
      data: prismaUserData,
    });
    return UserMapper.toDomain(createdPrismaUser);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(): Promise<UserAggregate[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    return prismaUsers.map((prismaUser) => UserMapper.toDomain(prismaUser));
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findWithPermissionsByEmail(
    email: string,
  ): Promise<UserWithPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const permissions = user.roles.flatMap((role) => role.permissions);
    const uniquePermissions = [
      ...new Map(
        permissions.map((p) => [`${p.action}:${p.subject}`, p]),
      ).values(),
    ];

    const aggregate = UserMapper.toDomain(user);

    (aggregate as UserWithPermissions).permissions = uniquePermissions.map(
      (p) => ({
        action: p.action,
        subject: p.subject,
      }),
    );

    return aggregate as UserWithPermissions;
  }
}
