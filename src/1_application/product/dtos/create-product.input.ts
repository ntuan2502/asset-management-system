import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @Field(() => ID)
  @IsCuid()
  categoryId: string;

  @Field(() => ID)
  @IsCuid()
  manufacturerId: string;
}
