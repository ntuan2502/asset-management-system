import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
export class GetAllCategoriesQuery {
  constructor(public readonly args: PaginationArgs) {}
}
