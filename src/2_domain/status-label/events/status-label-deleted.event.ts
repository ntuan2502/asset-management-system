import { IEvent } from '@nestjs/cqrs';

export interface StatusLabelDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class StatusLabelDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: StatusLabelDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
