import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetOfficeByIdQuery } from '../impl/get-office-by-id.query';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';

@QueryHandler(GetOfficeByIdQuery)
export class GetOfficeByIdHandler implements IQueryHandler<GetOfficeByIdQuery> {
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepository: IOfficeRepository,
  ) {}

  async execute(query: GetOfficeByIdQuery) {
    return this.officeRepository.findById(query.id);
  }
}
