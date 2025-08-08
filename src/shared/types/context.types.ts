import { Request } from 'express';
// UserWithPermissions đã bao gồm UserAggregate và permissions
import { UserWithPermissions } from 'src/2_domain/user/repositories/user.repository.interface';

// Kiểu này sẽ đại diện cho đối tượng `user` được gắn vào request
// Nó là một UserAggregate, có thêm permissions, và có thêm sessionId
export type AuthenticatedUser = UserWithPermissions & { sessionId: string };

// Mở rộng interface Request của Express
export interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

// Định nghĩa cấu trúc của GraphQL Context
export interface GqlContext {
  req: RequestWithUser;
}
