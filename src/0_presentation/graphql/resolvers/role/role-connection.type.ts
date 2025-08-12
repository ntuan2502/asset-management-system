import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { RoleType } from './role.type';

@ObjectType()
export class RoleConnection extends Paginated(RoleType) {}
