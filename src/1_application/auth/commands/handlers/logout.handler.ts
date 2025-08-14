import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LogoutCommand } from '../impl/logout.command';
import { AUTH_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutCommand): Promise<boolean> {
    const { user } = command;
    const sessionId = user.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException(AUTH_ERRORS.SESSION_ID_NOT_FOUND);
    }

    return this.authService.logout(sessionId);
  }
}
