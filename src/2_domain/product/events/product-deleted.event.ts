import { IEvent } from '@nestjs/cqrs';

export interface ProductDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class ProductDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: ProductDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
