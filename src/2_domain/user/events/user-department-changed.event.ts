import { IEvent } from '@nestjs/cqrs';

export interface UserDepartmentChangedPayload {
  id: string;
  newDepartmentId: string | null;
  changedAt: Date;
}

export class UserDepartmentChangedEvent implements IEvent {
  public readonly id: string;
  public readonly newDepartmentId: string | null;
  public readonly changedAt: Date;

  constructor(payload: UserDepartmentChangedPayload) {
    Object.assign(this, payload);
    if (this.changedAt) {
      this.changedAt = new Date(this.changedAt);
    }
  }
}
