import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the new category for the product',
  })
  @IsOptional()
  @IsCuid()
  categoryId?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the new manufacturer for the product',
  })
  @IsOptional()
  @IsCuid()
  manufacturerId?: string;
}
