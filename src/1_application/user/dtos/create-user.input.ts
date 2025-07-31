import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field() // << THÊM MỚI
  password: string; // << THÊM MỚI

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  // Các trường dob, gender sẽ thêm sau để giữ cho bước này tập trung
}
