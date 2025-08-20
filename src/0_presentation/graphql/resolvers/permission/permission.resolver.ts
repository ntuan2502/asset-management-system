import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { PermissionType } from './permission.type';
import { GetAllPermissionsQuery } from 'src/1_application/permission/queries/impl/get-all-permissions.query';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { PermissionConnection } from './permission-connection.type';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedPermissionsResult } from 'src/1_application/permission/queries/handlers/get-all-permissions.handler';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';

@Resolver(() => PermissionType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PermissionResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => PermissionConnection, { name: 'permissions' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.PERMISSION,
  })
  async getAllPermissions(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedPermissionsResult> {
    return this.queryBus.execute(new GetAllPermissionsQuery(args));
  }
}
