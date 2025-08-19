import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { StatusLabelType } from './status-label.type';

@ObjectType()
export class StatusLabelConnection extends Paginated(StatusLabelType) {}
