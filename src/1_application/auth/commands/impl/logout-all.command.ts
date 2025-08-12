import { AuthenticatedUser } from 'src/shared/types/context.types';

export class LogoutAllCommand {
  constructor(public readonly user: AuthenticatedUser) {}
}
