import { registerEnumType } from '@nestjs/graphql';

export enum ValueTypeEnum {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
}

registerEnumType(ValueTypeEnum, {
  name: 'ValueTypeEnum',
  description: 'The data type of the attribute value.',
});
