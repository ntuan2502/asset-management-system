import { IEvent } from '@nestjs/cqrs';

export interface ManufacturerUpdatedPayload {
  id: string;
  name?: string;
  updatedAt: Date;
}

export class ManufacturerUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly updatedAt: Date;

  constructor(payload: ManufacturerUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
