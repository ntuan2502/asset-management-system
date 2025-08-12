import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ALL_APP_PERMISSIONS } from 'src/2_domain/auth/constants/app-permissions';

@Injectable()
export class PermissionSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    console.log('Seeding permissions...');

    await this.prisma.$transaction(async (tx) => {
      const existingPermissions = await tx.permission.findMany();
      const existingPermissionMap = new Map(
        existingPermissions.map((p) => [`${p.action}:${p.subject}`, true]),
      );

      const newPermissions = ALL_APP_PERMISSIONS.filter((p) => {
        const key = `${p.action}:${p.subject}`;
        return !existingPermissionMap.has(key);
      });

      if (newPermissions.length > 0) {
        await tx.permission.createMany({
          data: newPermissions,
          skipDuplicates: true,
        });
        console.log(`Created ${newPermissions.length} new permissions.`);
      } else {
        console.log('No new permissions to seed.');
      }
    });
  }
}
