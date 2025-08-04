import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ALL_APP_PERMISSIONS } from 'src/2_domain/auth/constants/app-permissions';

@Injectable()
export class PermissionSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    console.log('Seeding permissions...');

    // Dùng transaction để đảm bảo tất cả các thao tác đều thành công
    await this.prisma.$transaction(async (tx) => {
      // 1. Lấy tất cả các permission hiện có trong DB
      const existingPermissions = await tx.permission.findMany();
      const existingPermissionMap = new Map(
        existingPermissions.map((p) => [`${p.action}:${p.subject}`, true]), // Chuyển thành [key, value]
      );

      // 2. Tìm ra các permission mới cần được tạo
      const newPermissions = ALL_APP_PERMISSIONS.filter((p) => {
        const key = `${p.action}:${p.subject}`;
        return !existingPermissionMap.has(key);
      });

      // 3. Nếu có permission mới, tạo chúng
      if (newPermissions.length > 0) {
        await tx.permission.createMany({
          data: newPermissions,
          skipDuplicates: true, // Bỏ qua nếu có lỗi trùng lặp (dù đã lọc)
        });
        console.log(`Created ${newPermissions.length} new permissions.`);
      } else {
        console.log('No new permissions to seed.');
      }
    });
  }
}
