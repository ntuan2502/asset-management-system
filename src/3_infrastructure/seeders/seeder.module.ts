import { Module } from '@nestjs/common';
import { PermissionSeeder } from './permission.seeder';
import { UserSeeder } from './user.seeder';
import { UserModule } from 'src/2_domain/user/user.module';
import { RoleModule } from 'src/2_domain/role/role.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../persistence/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    CqrsModule,
    UserModule,
    RoleModule,
  ],
  providers: [PermissionSeeder, UserSeeder],
})
export class SeederModule {}
