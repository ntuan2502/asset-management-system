import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/shared/types/context.types'; // << IMPORT

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // SỬA LẠI: Lấy context đã được định kiểu
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const { req } = ctx;

    if (!req.user) {
      throw new UnauthorizedException('Authentication is required.');
    }
    return true;
  }
}
