import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { AttributeType } from './attribute.type';

@ObjectType()
export class AttributeConnection extends Paginated(AttributeType) {}
