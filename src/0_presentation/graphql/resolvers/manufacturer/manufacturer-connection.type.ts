import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { ManufacturerType } from './manufacturer.type';

@ObjectType()
export class ManufacturerConnection extends Paginated(ManufacturerType) {}
