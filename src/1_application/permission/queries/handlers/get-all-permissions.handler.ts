import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllPermissionsQuery } from '../impl/get-all-permissions.query';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY,
} from 'src/2_domain/permission/repositories/permission.repository.interface';
import { PermissionAggregate } from 'src/2_domain/permission/aggregates/permission.aggregate';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from 'src/shared/constants/pagination.constants';

export type PaginatedPermissionsResult = {
  nodes: PermissionAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsHandler
  implements IQueryHandler<GetAllPermissionsQuery, PaginatedPermissionsResult>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(
    query: GetAllPermissionsQuery,
  ): Promise<PaginatedPermissionsResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;

    const result = await this.permissionRepository.findAll({ page, limit });

    const totalPages = Math.ceil(result.meta.totalCount / limit);

    return {
      nodes: result.nodes,
      meta: {
        ...result.meta,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
