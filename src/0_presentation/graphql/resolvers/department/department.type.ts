import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { OfficeType } from '../office/office.type';

@ObjectType('Department')
export class DepartmentType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => OfficeType)
  office: OfficeType;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
