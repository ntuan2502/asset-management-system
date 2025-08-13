import { IEvent } from '@nestjs/cqrs';

export interface DepartmentRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class DepartmentRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: DepartmentRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
