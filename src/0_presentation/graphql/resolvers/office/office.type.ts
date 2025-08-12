import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Office')
export class OfficeType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  internationalName: string;

  @Field()
  shortName: string;

  @Field()
  taxCode: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
