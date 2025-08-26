import { IEvent } from '@nestjs/cqrs';

export interface ProductManufacturerChangedPayload {
  id: string;
  newManufacturerId: string;
  changedAt: Date;
}

export class ProductManufacturerChangedEvent implements IEvent {
  public readonly id: string;
  public readonly newManufacturerId: string;
  public readonly changedAt: Date;

  constructor(payload: ProductManufacturerChangedPayload) {
    Object.assign(this, payload);
    if (this.changedAt) {
      this.changedAt = new Date(this.changedAt);
    }
  }
}
