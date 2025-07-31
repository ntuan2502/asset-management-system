import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserAggregate[]> {
    return this.userRepository.findAll();
  }
}
