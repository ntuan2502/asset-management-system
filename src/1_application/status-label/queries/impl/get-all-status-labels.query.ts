import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
export class GetAllStatusLabelsQuery {
  constructor(public readonly args: PaginationArgs) {}
}
