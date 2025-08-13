import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetOfficeByIdQuery } from '../impl/get-office-by-id.query';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate'; // << Import

@QueryHandler(GetOfficeByIdQuery)
export class GetOfficeByIdHandler
  implements IQueryHandler<GetOfficeByIdQuery, OfficeAggregate | null>
{
  constructor(
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepository: IOfficeRepository,
  ) {}

  async execute(query: GetOfficeByIdQuery): Promise<OfficeAggregate | null> {
    return this.officeRepository.findById(query.id);
  }
}
