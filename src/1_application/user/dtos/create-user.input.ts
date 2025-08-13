import { Field, InputType, GraphQLISODateTime, ID } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDate,
  IsEnum,
} from 'class-validator';
import { GenderEnum } from 'src/2_domain/user/enums/gender.enum';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
    description: 'ID of the office the user belongs to',
  })
  @IsOptional()
  @IsCuid()
  officeId?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'ID of the department the user belongs to',
  })
  @IsOptional()
  @IsCuid()
  departmentId?: string;
}
