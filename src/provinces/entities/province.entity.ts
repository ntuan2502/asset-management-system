import { ObjectType, Field } from '@nestjs/graphql';
import { Ward } from 'src/wards/entities/ward.entity';

@ObjectType()
export class Province {
  @Field(() => String)
  id: string;

  @Field(() => String)
  provinceCode: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  shortName: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  placeType: string;

  @Field(() => String)
  country: string;

  @Field(() => [Ward], { nullable: true })
  wards?: Ward[];
}
