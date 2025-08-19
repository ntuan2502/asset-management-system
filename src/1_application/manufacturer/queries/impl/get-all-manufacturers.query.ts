import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
export class GetAllManufacturersQuery {
  constructor(public readonly args: PaginationArgs) {}
}
