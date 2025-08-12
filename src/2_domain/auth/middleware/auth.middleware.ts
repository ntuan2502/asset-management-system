import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { RequestWithUser } from 'src/shared/types/context.types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const user = await this.authService.validateAndGetUserFromToken(req);

    if (user) {
      req.user = user;
    }

    next();
  }
}
