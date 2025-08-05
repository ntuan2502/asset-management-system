import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { IsCuid } from 'src/shared/validators/is-cuid.validator';

@InputType()
export class AssignPermissionsToRoleInput {
  @Field(() => [ID])
  @IsArray()
  @IsCuid({ each: true })
  permissionIds: string[];
}
