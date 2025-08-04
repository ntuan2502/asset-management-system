import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Permission')
export class PermissionType {
  @Field(() => ID)
  id: string;

  @Field()
  action: string;

  @Field()
  subject: string;
}
