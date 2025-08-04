import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetRoleByIdQuery } from '../impl/get-role-by-id.query';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdHandler implements IQueryHandler<GetRoleByIdQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: GetRoleByIdQuery) {
    return this.roleRepository.findById(query.id);
  }
}
