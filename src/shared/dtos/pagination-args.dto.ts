import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../constants/pagination.constants';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: DEFAULT_PAGE, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @Field(() => Int, { defaultValue: DEFAULT_LIMIT, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;
}
