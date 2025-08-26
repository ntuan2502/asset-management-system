import { IEvent } from '@nestjs/cqrs';

export interface ProductCategoryChangedPayload {
  id: string;
  newCategoryId: string;
  changedAt: Date;
}

export class ProductCategoryChangedEvent implements IEvent {
  public readonly id: string;
  public readonly newCategoryId: string;
  public readonly changedAt: Date;

  constructor(payload: ProductCategoryChangedPayload) {
    Object.assign(this, payload);
    if (this.changedAt) {
      this.changedAt = new Date(this.changedAt);
    }
  }
}
