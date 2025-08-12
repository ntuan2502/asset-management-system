import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { JwtPayload } from 'jsonwebtoken';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid refresh token payload.');
      }

      return this.authService.refreshToken(payload.sub, refreshToken);
    } catch (error) {
      console.error('Refresh token validation failed:', error);
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }
  }
}
