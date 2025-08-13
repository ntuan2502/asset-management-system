import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
