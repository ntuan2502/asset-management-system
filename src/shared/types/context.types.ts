import { Request } from 'express';
import { UserWithPermissions } from 'src/2_domain/user/repositories/user.repository.interface';

export type AuthenticatedUser = UserWithPermissions & { sessionId: string };

export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

export interface GqlContext {
  req: RequestWithUser;
}
