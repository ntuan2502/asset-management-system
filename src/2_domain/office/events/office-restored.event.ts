import { IEvent } from '@nestjs/cqrs';

export interface OfficeRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class OfficeRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: OfficeRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
