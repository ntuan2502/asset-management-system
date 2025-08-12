import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LogoutAllCommand } from '../impl/logout-all.command';

@CommandHandler(LogoutAllCommand)
export class LogoutAllHandler implements ICommandHandler<LogoutAllCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutAllCommand): Promise<boolean> {
    const { user } = command;

    return this.authService.logoutAll(user.id);
  }
}
