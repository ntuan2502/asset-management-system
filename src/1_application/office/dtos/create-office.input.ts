import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateOfficeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  internationalName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  shortName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  taxCode: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
