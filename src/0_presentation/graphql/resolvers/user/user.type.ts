import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  // --- THÊM MỚI CÁC TRƯỜNG ---

  @Field(() => GraphQLISODateTime, { nullable: true }) // Dùng kiểu DateTime của GraphQL
  dob: Date;

  @Field({ nullable: true })
  gender: string;

  @Field(() => GraphQLISODateTime) // Kiểu DateTime cho ngày tháng
  createdAt: Date;

  @Field(() => GraphQLISODateTime) // Kiểu DateTime cho ngày tháng
  updatedAt: Date;
}
