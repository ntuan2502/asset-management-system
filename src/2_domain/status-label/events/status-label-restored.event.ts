import { IEvent } from '@nestjs/cqrs';

export interface StatusLabelRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class StatusLabelRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: StatusLabelRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
