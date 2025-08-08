import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType('Session')
export class SessionType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  userAgent: string | null;

  @Field(() => String, { nullable: true })
  ipAddress: string | null;

  @Field(() => GraphQLISODateTime)
  expiresAt: Date;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;
}
