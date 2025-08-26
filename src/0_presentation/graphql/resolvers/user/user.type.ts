import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { OfficeType } from '../office/office.type';
import { DepartmentType } from '../department/department.type';
import { RoleType } from '../role/role.type';

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

  @Field(() => GraphQLISODateTime, { nullable: true })
  dob: Date;

  @Field({ nullable: true })
  gender: string;

  @Field(() => [RoleType], { nullable: 'itemsAndList' })
  roles: RoleType[];

  @Field(() => OfficeType, { nullable: true })
  office?: OfficeType;

  @Field(() => DepartmentType, { nullable: true })
  department?: DepartmentType;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
