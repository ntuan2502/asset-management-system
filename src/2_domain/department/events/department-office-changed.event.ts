import { IEvent } from '@nestjs/cqrs';

export interface DepartmentOfficeChangedPayload {
  id: string;
  newOfficeId: string;
  changedAt: Date;
}

export class DepartmentOfficeChangedEvent implements IEvent {
  public readonly id: string;
  public readonly newOfficeId: string;
  public readonly changedAt: Date;

  constructor(payload: DepartmentOfficeChangedPayload) {
    Object.assign(this, payload);
    if (this.changedAt) {
      this.changedAt = new Date(this.changedAt);
    }
  }
}
