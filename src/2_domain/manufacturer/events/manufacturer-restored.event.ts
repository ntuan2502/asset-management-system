import { IEvent } from '@nestjs/cqrs';

export interface ManufacturerRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class ManufacturerRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: ManufacturerRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
