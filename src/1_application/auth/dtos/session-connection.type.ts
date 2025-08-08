import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'src/shared/dtos/pagination.dto';
import { SessionType } from './session.type';

@ObjectType()
export class SessionConnection extends Paginated(SessionType) {}
