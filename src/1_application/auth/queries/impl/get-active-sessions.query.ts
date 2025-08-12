import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { AuthenticatedUser } from 'src/shared/types/context.types';
export class GetActiveSessionsQuery {
  constructor(
    public readonly user: AuthenticatedUser,
    public readonly args: PaginationArgs,
  ) {}
}
