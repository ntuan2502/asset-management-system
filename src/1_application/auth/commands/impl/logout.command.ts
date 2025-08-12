import { AuthenticatedUser } from 'src/shared/types/context.types';

export class LogoutCommand {
  constructor(public readonly user: AuthenticatedUser) {}
}
