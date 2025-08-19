import { StatusLabelAggregate } from '../aggregates/status-label.aggregate';

export interface PaginatedStatusLabels {
  nodes: StatusLabelAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const STATUS_LABEL_REPOSITORY = 'STATUS_LABEL_REPOSITORY';

export interface IStatusLabelRepository {
  findByName(name: string): Promise<StatusLabelAggregate | null>;
  findById(id: string): Promise<StatusLabelAggregate | null>;
  findAll(args: {
    page: number;
    limit: number;
  }): Promise<PaginatedStatusLabels>;
}
