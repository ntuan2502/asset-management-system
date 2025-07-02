import { ObjectType, Field } from '@nestjs/graphql';
import { Province } from 'src/provinces/entities/province.entity';

@ObjectType()
export class Ward {
  @Field(() => String)
  id: string;

  @Field(() => String)
  wardCode: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  provinceCode: string;

  @Field(() => Province, { nullable: true })
  province?: Province;
}
