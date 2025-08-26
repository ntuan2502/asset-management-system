import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

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

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the new office for the department',
  })
  @IsOptional()
  @IsCuid()
  officeId?: string;
}
