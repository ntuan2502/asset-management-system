import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/2_domain/user/user.module'; // Import UserModule để dùng các provider của nó
import { AuthResolver } from 'src/0_presentation/graphql/resolvers/auth/auth.resolver';

@Module({
  imports: [
    // Import UserModule để AuthModule có thể inject IUserRepository
    UserModule,
    PassportModule,
    // ConfigModule đã là global, không cần import lại nhưng ConfigService cần nó
    ConfigModule,
    // Cấu hình JwtModule để nó có thể tạo và xác thực token
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule để dùng ConfigService
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Token sẽ hết hạn sau 60 phút
      }),
      inject: [ConfigService], // Inject ConfigService vào useFactory
    }),
  ],
  // Đăng ký các provider của module này
  providers: [
    AuthService,
    JwtStrategy,
    AuthResolver,
    // Không cần đăng ký IUserRepository ở đây vì nó đã được cung cấp bởi UserModule
  ],
  // Export AuthService để các module khác (nếu cần) có thể sử dụng
  exports: [AuthService],
})
export class AuthModule {}
