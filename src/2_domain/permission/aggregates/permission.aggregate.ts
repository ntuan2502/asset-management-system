import { AGGREGATE_TYPES } from 'src/shared/constants/aggregate-types.constants';
import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';

export class PermissionAggregate extends BaseAggregateRoot {
  public readonly aggregateType = AGGREGATE_TYPES.PERMISSION;

  public action: string;
  public subject: string;
  public createdAt: Date;
  public updatedAt: Date;
}
