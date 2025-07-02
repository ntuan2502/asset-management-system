import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  username?: string | null;

  @Field(() => String)
  @IsString()
  fullname: string;
}
