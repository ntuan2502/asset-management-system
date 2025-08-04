import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { IRoleRepository } from 'src/2_domain/role/repositories/role.repository.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { RoleMapper } from 'src/1_application/role/mappers/role.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string): Promise<RoleAggregate | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findById(id: string): Promise<RoleAggregate | null> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? RoleMapper.toDomain(role) : null;
  }

  async findAll(): Promise<RoleAggregate[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((role) => RoleMapper.toDomain(role));
  }
}
