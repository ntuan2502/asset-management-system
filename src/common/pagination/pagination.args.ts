// src/common/pagination/pagination.args.ts
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1 })
  @Min(1, { message: 'Page must be >= 1' })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @Min(0, { message: 'Limit must be >= 0' })
  limit: number = 10;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
