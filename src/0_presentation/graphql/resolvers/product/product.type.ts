import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { CategoryType } from '../category/category.type';
import { ManufacturerType } from '../manufacturer/manufacturer.type';

@ObjectType('Product')
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  modelNumber: string;

  @Field(() => CategoryType)
  category: CategoryType;

  @Field(() => ManufacturerType)
  manufacturer: ManufacturerType;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
