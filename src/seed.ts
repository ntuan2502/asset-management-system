import { NestFactory } from '@nestjs/core';
import { SeederModule } from './3_infrastructure/seeders/seeder.module';
import { PermissionSeeder } from './3_infrastructure/seeders/permission.seeder';
import { UserSeeder } from './3_infrastructure/seeders/user.seeder';
import { SYSTEM_ERRORS } from './shared/constants/error-messages.constants';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  console.log('Starting the seeding process...');

  const permissionSeeder = app.get(PermissionSeeder);
  const userSeeder = app.get(UserSeeder);

  await permissionSeeder.seed();
  await userSeeder.seed();

  console.log('Seeding process finished.');

  await app.close();
}

bootstrap().catch((err) => console.error(SYSTEM_ERRORS.BOOTSTRAP_FAILED, err));
