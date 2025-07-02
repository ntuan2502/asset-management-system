// src/common/pagination/pagination.args.ts
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1 })
  @Min(1, { message: 'Page must be >= 1' })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @Min(1, { message: 'Limit must be >= 1' })
  limit: number = 10;
}
