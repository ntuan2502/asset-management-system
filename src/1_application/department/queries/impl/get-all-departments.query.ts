import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';

export class GetAllDepartmentsQuery {
  constructor(public readonly args: PaginationArgs) {}
}
