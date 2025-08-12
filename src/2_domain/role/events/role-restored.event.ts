import { IEvent } from '@nestjs/cqrs';

export interface RoleRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class RoleRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: RoleRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
