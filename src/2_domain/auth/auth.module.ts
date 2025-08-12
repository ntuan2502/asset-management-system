import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/2_domain/user/user.module';
import { AuthResolver } from 'src/0_presentation/graphql/resolvers/auth/auth.resolver';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaModule } from 'src/3_infrastructure/persistence/prisma/prisma.module';
import { LoginHandler } from 'src/1_application/auth/commands/handlers/login.handler';
import { RefreshTokenHandler } from 'src/1_application/auth/commands/handlers/refresh-token.handler';
import { GetActiveSessionsHandler } from 'src/1_application/auth/queries/handlers/get-active-sessions.handler';
import { LogoutHandler } from 'src/1_application/auth/commands/handlers/logout.handler';
import { LogoutAllHandler } from 'src/1_application/auth/commands/handlers/logout-all.handler';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [
  LoginHandler,
  RefreshTokenHandler,
  LogoutHandler,
  LogoutAllHandler,
];
const QueryHandlers = [GetActiveSessionsHandler];

@Module({
  imports: [
    CqrsModule,
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
  providers: [
    AuthService,
    AuthResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    PermissionsGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
