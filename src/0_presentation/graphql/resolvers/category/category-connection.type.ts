import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { CategoryType } from './category.type';

@ObjectType()
export class CategoryConnection extends Paginated(CategoryType) {}
