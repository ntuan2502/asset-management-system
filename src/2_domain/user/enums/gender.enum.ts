import { registerEnumType } from '@nestjs/graphql';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Đăng ký Enum này với NestJS GraphQL
registerEnumType(GenderEnum, {
  name: 'GenderEnum',
  description: 'The gender of the user.',
});
