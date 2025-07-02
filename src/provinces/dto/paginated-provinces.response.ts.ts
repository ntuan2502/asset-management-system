// users/dto/user-pagination.response.ts
import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/pagination/paginated-response.factory';
import { Province } from '../entities/province.entity';

@ObjectType()
export class PaginatedProvinces extends PaginatedResponse(Province) {}
