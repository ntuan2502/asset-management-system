import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllRolesQuery } from '../impl/get-all-roles.query';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesHandler implements IQueryHandler<GetAllRolesQuery> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(_query: GetAllRolesQuery) {
    return this.roleRepository.findAll();
  }
}
