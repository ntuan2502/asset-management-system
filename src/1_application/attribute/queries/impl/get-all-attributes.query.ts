import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
export class GetAllAttributesQuery {
  constructor(public readonly args: PaginationArgs) {}
}
