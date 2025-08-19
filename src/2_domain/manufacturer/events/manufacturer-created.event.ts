import { IEvent } from '@nestjs/cqrs';

export interface ManufacturerCreatedPayload {
  id: string;
  name: string;
  createdAt: Date;
}

export class ManufacturerCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;

  constructor(payload: ManufacturerCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
