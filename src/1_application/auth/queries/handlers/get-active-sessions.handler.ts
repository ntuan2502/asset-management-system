import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { GetActiveSessionsQuery } from '../impl/get-active-sessions.query';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from 'src/shared/constants/pagination.constants';
import { Session } from '@prisma/client';
import { PaginationMeta } from 'src/shared/dtos/pagination.dto';

export type PaginatedSessionsResult = {
  nodes: Session[];
  meta: PaginationMeta;
};

@QueryHandler(GetActiveSessionsQuery)
export class GetActiveSessionsHandler
  implements IQueryHandler<GetActiveSessionsQuery, PaginatedSessionsResult>
{
  constructor(private readonly authService: AuthService) {}
  async execute(
    query: GetActiveSessionsQuery,
  ): Promise<PaginatedSessionsResult> {
    const { user, args } = query;
    const page = args.page ?? DEFAULT_PAGE;
    const limit = args.limit ?? DEFAULT_LIMIT;

    const result = await this.authService.getActiveSessions(user.id, {
      page,
      limit,
    });

    const totalPages = Math.ceil(result.meta.totalCount / limit);

    return {
      nodes: result.nodes,
      meta: {
        ...result.meta,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
