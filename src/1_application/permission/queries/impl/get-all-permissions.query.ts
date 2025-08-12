import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';

export class GetAllPermissionsQuery {
  constructor(public readonly args: PaginationArgs) {}
}
