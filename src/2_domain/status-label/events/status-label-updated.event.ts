import { IEvent } from '@nestjs/cqrs';

export interface StatusLabelUpdatedPayload {
  id: string;
  name?: string;
  updatedAt: Date;
}

export class StatusLabelUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly updatedAt: Date;

  constructor(payload: StatusLabelUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
