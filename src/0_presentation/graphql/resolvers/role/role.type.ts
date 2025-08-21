import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PermissionType } from '../permission/permission.type';

@ObjectType('Role')
export class RoleType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [PermissionType], { nullable: 'itemsAndList' })
  permissions: PermissionType[];
}
