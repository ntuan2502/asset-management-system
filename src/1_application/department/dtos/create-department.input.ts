import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field(() => ID)
  @IsCuid() // Đảm bảo officeId là một CUID hợp lệ
  officeId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
