import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AUTH_ERRORS } from 'src/shared/constants/error-messages.constants';
import { GqlContext } from 'src/shared/types/context.types';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const { req } = ctx;

    if (!req.user) {
      throw new UnauthorizedException(AUTH_ERRORS.AUTHENTICATION_REQUIRED);
    }
    return true;
  }
}
