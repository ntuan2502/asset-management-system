import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LogoutCommand } from '../impl/logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutCommand): Promise<boolean> {
    const { user } = command;
    const sessionId = user.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Session ID not found in token.');
    }

    return this.authService.logout(sessionId);
  }
}
