import { NestFactory } from '@nestjs/core';
import { SeederModule } from './3_infrastructure/seeders/seeder.module';
import { PermissionSeeder } from './3_infrastructure/seeders/permission.seeder';
import { UserSeeder } from './3_infrastructure/seeders/user.seeder';

async function bootstrap() {
  // Khởi tạo một ứng dụng độc lập (standalone application)
  // chỉ dựa trên SeederModule. NestJS sẽ tự động resolve các dependency
  // mà SeederModule import (như UserModule, RoleModule, CqrsModule).
  const app = await NestFactory.createApplicationContext(SeederModule);

  console.log('Starting the seeding process...');

  // Lấy instance của các seeder từ context của ứng dụng
  const permissionSeeder = app.get(PermissionSeeder);
  const userSeeder = app.get(UserSeeder);

  // Chạy các phương thức seed theo đúng thứ tự
  await permissionSeeder.seed();
  await userSeeder.seed();

  console.log('Seeding process finished.');

  // Đóng ứng dụng để script kết thúc
  await app.close();
}

bootstrap().catch((err) =>
  console.error('Error during application bootstrap', err),
);
