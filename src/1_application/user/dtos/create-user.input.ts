import { Field, InputType, GraphQLISODateTime } from '@nestjs/graphql';
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
}
