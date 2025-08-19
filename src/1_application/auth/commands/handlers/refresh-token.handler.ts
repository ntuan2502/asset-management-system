import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { AUTH_ERRORS } from 'src/shared/constants/error-messages.constants';
import { RefreshTokenPayload } from 'src/2_domain/auth/types/jwt-payload.types';

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
      throw new UnauthorizedException(AUTH_ERRORS.REFRESH_TOKEN_MISSING);
    }

    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (!payload.sub || !payload.sessionId) {
        throw new UnauthorizedException(
          AUTH_ERRORS.REFRESH_TOKEN_INVALID_PAYLOAD,
        );
      }

      return this.authService.refreshToken(
        payload.sub,
        refreshToken,
        payload.sessionId,
      );
    } catch (error) {
      console.error(AUTH_ERRORS.REFRESH_TOKEN_INVALID_OR_EXPIRED, error);
      throw new UnauthorizedException(
        AUTH_ERRORS.REFRESH_TOKEN_INVALID_OR_EXPIRED,
      );
    }
  }
}
