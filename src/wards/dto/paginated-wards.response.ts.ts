// users/dto/user-pagination.response.ts
import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.factory';
import { Ward } from '../entities/ward.entity';

@ObjectType()
export class PaginatedWards extends PaginatedResponse(Ward) {}
