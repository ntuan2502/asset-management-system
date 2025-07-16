// src/common/pagination/paginated-response.factory.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationMeta } from './pagination-meta.model';

export function PaginatedResponse<TItem>(TItemClass: Type<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items: TItem[];

    @Field(() => PaginationMeta)
    pagination: PaginationMeta;
  }

  return PaginatedResponseClass;
}
