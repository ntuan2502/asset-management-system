import { Request } from 'express';
import { UserWithPermissions } from 'src/2_domain/user/repositories/user.repository.interface';

export interface RequestWithUser extends Request {
  user: UserWithPermissions;
}

export interface GqlContext {
  req: RequestWithUser;
}
