import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllRolesQuery } from '../impl/get-all-roles.query';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from 'src/shared/constants/pagination.constants';

export type PaginatedRolesResult = {
  nodes: RoleAggregate[];
  meta: PaginationMeta;
};

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesHandler
  implements IQueryHandler<GetAllRolesQuery, PaginatedRolesResult>
{
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetAllRolesQuery): Promise<PaginatedRolesResult> {
    const page = query.args.page ?? DEFAULT_PAGE;
    const limit = query.args.limit ?? DEFAULT_LIMIT;

    const result = await this.roleRepository.findAll({ page, limit });

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
