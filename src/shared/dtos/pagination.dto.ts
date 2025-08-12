import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPrevPage: boolean;
}

export function Paginated<TItem>(TItemClass: Type<TItem>) {
  @ObjectType(`${TItemClass.name}Connection`, { isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    nodes: TItem[];

    @Field(() => PaginationMeta)
    meta: PaginationMeta;
  }

  return PaginatedResponseClass;
}
