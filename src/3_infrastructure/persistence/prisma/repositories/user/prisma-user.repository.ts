import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  PaginatedUsers,
  UserWithPermissions,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { PrismaService } from '../../prisma.service';
import { UserMapper } from 'src/1_application/user/mappers/user.mapper';

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
      include: { roles: true },
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<UserAggregate | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: { roles: true },
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedUsers> {
    const { page, limit } = args;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        include: { roles: true },
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
    ]);

    return {
      nodes: users.map((user) => UserMapper.toDomain(user)),
      meta: {
        totalCount,
        page,
        limit,
      },
    };
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

  async findWithPermissionsById(
    id: string,
  ): Promise<UserWithPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
