import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';

export class GetAllOfficesQuery {
  constructor(public readonly args: PaginationArgs) {}
}
