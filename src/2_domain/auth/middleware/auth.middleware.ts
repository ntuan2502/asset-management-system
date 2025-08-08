import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { RequestWithUser } from 'src/shared/types/context.types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // Gọi phương thức xác thực token từ AuthService
    // Phương thức này sẽ trả về user nếu hợp lệ, hoặc null nếu không
    const user = await this.authService.validateAndGetUserFromToken(req);

    // Gắn user (hoặc null) vào đối tượng request
    if (user) {
      req.user = user;
    }

    // Cho phép request đi tiếp đến bước tiếp theo (GraphQL resolver)
    next();
  }
}
