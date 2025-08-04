import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppPermission } from '../constants/app-permissions';
import { PERMISSION_KEY } from '../decorators/check-permissions.decorator';
import { GqlContext } from 'src/shared/types/context.types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<AppPermission>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const { user } = ctx.req;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Missing user permissions.');
    }

    const hasPermission = user.permissions.some(
      (p: AppPermission) =>
        p.action === requiredPermission.action &&
        p.subject === requiredPermission.subject,
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required permissions.');
    }

    return true;
  }
}
