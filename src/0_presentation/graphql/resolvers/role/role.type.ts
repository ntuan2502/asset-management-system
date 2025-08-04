import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Role')
export class RoleType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;
}
