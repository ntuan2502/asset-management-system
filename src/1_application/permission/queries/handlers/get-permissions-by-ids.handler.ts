import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPermissionsByIdsQuery } from '../impl/get-permissions-by-ids.query';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY,
} from 'src/2_domain/permission/repositories/permission.repository.interface';
import { PermissionAggregate } from 'src/2_domain/permission/aggregates/permission.aggregate';

@QueryHandler(GetPermissionsByIdsQuery)
export class GetPermissionsByIdsHandler
  implements IQueryHandler<GetPermissionsByIdsQuery, PermissionAggregate[]>
{
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(
    query: GetPermissionsByIdsQuery,
  ): Promise<PermissionAggregate[]> {
    if (!query.ids || query.ids.length === 0) {
      return [];
    }
    return this.permissionRepository.findByIds(query.ids);
  }
}
