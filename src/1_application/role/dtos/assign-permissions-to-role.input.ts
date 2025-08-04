import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';

@InputType()
export class AssignPermissionsToRoleInput {
  @Field(() => [ID])
  @IsArray()
  @IsUUID('all', { each: true }) // Giả sử ID của permission là UUID (hoặc CUID)
  permissionIds: string[];
}
