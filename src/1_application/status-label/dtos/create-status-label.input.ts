import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateStatusLabelInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
