import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';

export class GetAllUsersQuery {
  constructor(public readonly args: PaginationArgs) {}
}
