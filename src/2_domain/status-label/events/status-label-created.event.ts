import { IEvent } from '@nestjs/cqrs';

export interface StatusLabelCreatedPayload {
  id: string;
  name: string;
  createdAt: Date;
}

export class StatusLabelCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;

  constructor(payload: StatusLabelCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
