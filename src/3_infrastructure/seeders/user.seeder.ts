import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateRoleCommand } from 'src/1_application/role/commands/impl/create-role.command';
import { CreateUserCommand } from 'src/1_application/user/commands/impl/create-user.command';
import { AssignRoleToUserCommand } from 'src/1_application/user/commands/impl/assign-role-to-user.command';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { AssignPermissionsToRoleCommand } from 'src/1_application/role/commands/impl/assign-permissions-to-role.command';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async seed() {
    console.log('Seeding initial admin user and roles...');
    await this.seedAdminUser();
  }

  private async waitForProjection<T>(
    query: () => Promise<T | null>,
    timeout = 5000, // Chờ tối đa 5 giây
  ): Promise<T> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const result = await query();
      if (result) {
        return result;
      }
      // Đợi một chút trước khi thử lại
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error(`Projection timed out after ${timeout / 1000} seconds.`);
  }

  private async seedAdminUser() {
    try {
      let adminRole = await this.prisma.role.findUnique({
        where: { name: 'ADMIN' },
      });
      if (!adminRole) {
        console.log('Creating ADMIN role...');
        const createdRoleAggregate = await this.commandBus.execute<
          CreateRoleCommand,
          RoleAggregate
        >(
          new CreateRoleCommand({
            name: 'ADMIN',
            description: 'Super Administrator',
          }),
        );
        adminRole = await this.waitForProjection(() =>
          this.prisma.role.findUnique({
            where: { id: createdRoleAggregate.id },
          }),
        );
      }

      if (!adminRole) {
        throw new Error('Failed to create or find ADMIN role.');
      }

      const allPermissionIds = (
        await this.prisma.permission.findMany({ select: { id: true } })
      ).map((p) => p.id);
      console.log(
        `Assigning ${allPermissionIds.length} permissions to ADMIN role...`,
      );
      await this.commandBus.execute(
        new AssignPermissionsToRoleCommand(adminRole.id, {
          permissionIds: allPermissionIds,
        }),
      );

      const adminEmail = this.configService.get<string>(
        'ADMIN_EMAIL',
        'admin@example.com',
      );
      let adminUser = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!adminUser) {
        console.log('Creating ADMIN user...');
        const adminPassword = this.configService.get<string>(
          'ADMIN_PASSWORD',
          'SuperAdmin_123',
        );
        const createdUserAggregate = await this.commandBus.execute<
          CreateUserCommand,
          UserAggregate
        >(
          new CreateUserCommand({
            email: adminEmail,
            password: adminPassword,
            firstName: 'Super',
            lastName: 'Admin',
          }),
        );
        adminUser = await this.waitForProjection(() =>
          this.prisma.user.findUnique({
            where: { id: createdUserAggregate.id },
          }),
        );
      }

      if (!adminUser) {
        throw new Error('Failed to create or find ADMIN user.');
      }

      const userHasAdminRole = await this.prisma.user.findFirst({
        where: { id: adminUser.id, roles: { some: { id: adminRole.id } } },
      });

      if (!userHasAdminRole) {
        console.log('Assigning ADMIN role to ADMIN user...');
        await this.commandBus.execute(
          new AssignRoleToUserCommand(adminUser.id, adminRole.id),
        );
      }

      console.log('Admin user and roles seeded successfully.');
    } catch (error) {
      console.error('Error during seeding admin user:', error);
    }
  }
}
