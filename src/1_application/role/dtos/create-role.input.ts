import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
