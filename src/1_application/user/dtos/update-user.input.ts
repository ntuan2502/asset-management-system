import { Field, InputType, GraphQLISODateTime } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/2_domain/user/enums/gender.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional() // Cho phép trường này có thể không được cung cấp
  @IsString()
  @IsNotEmpty({ message: 'First name cannot be an empty string' }) // Nếu cung cấp, không được là chuỗi rỗng
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
}
