import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ValueTypeEnum } from 'src/2_domain/attribute/enums/value-type.enum';

@InputType()
export class CreateAttributeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @Field(() => ValueTypeEnum)
  @IsEnum(ValueTypeEnum)
  valueType: ValueTypeEnum;
}
