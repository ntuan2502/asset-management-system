import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';

export class GetAllProductsQuery {
  constructor(public readonly args: PaginationArgs) {}
}
