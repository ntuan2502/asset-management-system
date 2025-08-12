import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { OfficeType } from './office.type';

@ObjectType()
export class OfficeConnection extends Paginated(OfficeType) {}
