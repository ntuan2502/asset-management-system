import { Request } from 'express';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

// Mở rộng interface Request của Express để thêm thuộc tính `user`
export interface RequestWithUser extends Request {
  user: UserAggregate;
}

// Định nghĩa cấu trúc của GraphQL Context mà chúng ta đang sử dụng
export interface GqlContext {
  req: RequestWithUser;
}
