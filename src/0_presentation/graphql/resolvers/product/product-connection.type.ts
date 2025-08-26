import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { ProductType } from './product.type';

@ObjectType()
export class ProductConnection extends Paginated(ProductType) {}
