import { IEvent } from '@nestjs/cqrs';

export interface ProductRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class ProductRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: ProductRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
