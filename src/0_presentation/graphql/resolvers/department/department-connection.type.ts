import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { DepartmentType } from './department.type';

@ObjectType()
export class DepartmentConnection extends Paginated(DepartmentType) {}
