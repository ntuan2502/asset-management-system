import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetRolesByIdsQuery } from '../impl/get-roles-by-ids.query';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate'; // << Import

@QueryHandler(GetRolesByIdsQuery)
export class GetRolesByIdsHandler
  implements IQueryHandler<GetRolesByIdsQuery, RoleAggregate[]>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRolesByIdsQuery): Promise<RoleAggregate[]> {
    if (!query.ids || query.ids.length === 0) {
      return [];
    }
    return this.roleRepository.findByIds(query.ids);
  }
}
