import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';

export class PermissionAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.PERMISSION;

  public action: string;
  public subject: string;
  public createdAt: Date;
  public updatedAt: Date;
}
