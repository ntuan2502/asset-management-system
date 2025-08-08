import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/2_domain/user/user.module';
import { AuthResolver } from 'src/0_presentation/graphql/resolvers/auth/auth.resolver';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaModule } from 'src/3_infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, PermissionsGuard],
  exports: [AuthService],
})
export class AuthModule {}
