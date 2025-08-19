import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetManufacturerByIdQuery } from '../impl/get-manufacturer-by-id.query';
import {
  IManufacturerRepository,
  MANUFACTURER_REPOSITORY,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';

@QueryHandler(GetManufacturerByIdQuery)
export class GetManufacturerByIdHandler
  implements
    IQueryHandler<GetManufacturerByIdQuery, ManufacturerAggregate | null>
{
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(
    query: GetManufacturerByIdQuery,
  ): Promise<ManufacturerAggregate | null> {
    return this.manufacturerRepository.findById(query.id);
  }
}
