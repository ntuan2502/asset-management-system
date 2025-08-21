import { IEvent } from '@nestjs/cqrs';

export interface AttributeRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class AttributeRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: AttributeRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
