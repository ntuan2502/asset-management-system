import { Resolver, Query, Args } from '@nestjs/graphql';
import { WardsService } from './wards.service';
import { Ward } from './entities/ward.entity';
import { PaginatedWards } from './dto/paginated-wards.response.ts';
import { PaginationArgs } from 'src/common/pagination/pagination.args';

@Resolver(() => Ward)
export class WardsResolver {
  constructor(private readonly wardsService: WardsService) {}

  @Query(() => [Ward], { name: 'wards' })
  findAll() {
    return this.wardsService.findAll();
  }

  @Query(() => PaginatedWards, { name: 'paginatedWards' })
  users(@Args() pagination: PaginationArgs) {
    const { page, limit } = pagination;
    return this.wardsService.findAllPaginated(page, limit);
  }

  @Query(() => Ward, { name: 'ward' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.wardsService.findOne(id);
  }
}
