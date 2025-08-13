import { Field, InputType, GraphQLISODateTime, ID } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/2_domain/user/enums/gender.enum';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be an empty string' })
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be an empty string' })
  lastName?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @Field(() => GenderEnum, { nullable: true })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the new office for the user',
  })
  @IsOptional()
  @IsCuid()
  officeId?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the new department for the user',
  })
  @IsOptional()
  @IsCuid()
  departmentId?: string;
}
