import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { UserType } from './user.type';

@ObjectType()
export class UserConnection extends Paginated(UserType) {}
