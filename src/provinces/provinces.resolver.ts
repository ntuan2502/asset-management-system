import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProvincesService } from './provinces.service';
import { Province } from './entities/province.entity';
import { PaginatedProvinces } from './dto/paginated-provinces.response.ts';
import { PaginationArgs } from 'src/common/pagination/pagination.args';

@Resolver(() => Province)
export class ProvincesResolver {
  constructor(private readonly provincesService: ProvincesService) {}

  @Query(() => [Province], { name: 'provinces' })
  findAll() {
    return this.provincesService.findAll();
  }

  @Query(() => PaginatedProvinces, { name: 'paginatedProvinces' })
  users(@Args() pagination: PaginationArgs) {
    const { page, limit } = pagination;
    return this.provincesService.findAllPaginated(page, limit);
  }

  @Query(() => Province, { name: 'province' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.provincesService.findOne(id);
  }
}
