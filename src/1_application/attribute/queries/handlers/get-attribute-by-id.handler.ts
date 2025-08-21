import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAttributeByIdQuery } from '../impl/get-attribute-by-id.query';
import {
  IAttributeRepository,
  ATTRIBUTE_REPOSITORY,
} from 'src/2_domain/attribute/repositories/attribute.repository.interface';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';

@QueryHandler(GetAttributeByIdQuery)
export class GetAttributeByIdHandler
  implements IQueryHandler<GetAttributeByIdQuery, AttributeAggregate | null>
{
  constructor(
    @Inject(ATTRIBUTE_REPOSITORY)
    private readonly attributeRepository: IAttributeRepository,
  ) {}

  async execute(
    query: GetAttributeByIdQuery,
  ): Promise<AttributeAggregate | null> {
    return this.attributeRepository.findById(query.id);
  }
}
