// users/dto/user-pagination.response.ts
import { ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.factory';

@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) {}
