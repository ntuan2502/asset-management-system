import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { PermissionType } from './permission.type';

@ObjectType()
export class PermissionConnection extends Paginated(PermissionType) {}
