import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ValueTypeEnum } from 'src/2_domain/attribute/enums/value-type.enum';

@ObjectType('Attribute')
export class AttributeType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  unit: string;

  @Field(() => ValueTypeEnum)
  valueType: ValueTypeEnum;
}
