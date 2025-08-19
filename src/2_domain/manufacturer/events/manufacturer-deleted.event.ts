import { IEvent } from '@nestjs/cqrs';

export interface ManufacturerDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class ManufacturerDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: ManufacturerDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
