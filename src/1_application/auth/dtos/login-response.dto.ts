import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field({ nullable: true }) // Refresh token chỉ được trả về khi login
  refresh_token?: string;
}
