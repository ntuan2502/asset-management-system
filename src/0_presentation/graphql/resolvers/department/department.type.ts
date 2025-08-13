import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OfficeType } from '../office/office.type';

@ObjectType('Department')
export class DepartmentType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  // Có thể thêm field để lấy thông tin Office liên quan
  @Field(() => OfficeType)
  office: OfficeType;
}
