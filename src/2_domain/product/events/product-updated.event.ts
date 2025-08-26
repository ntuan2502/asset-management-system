import { IEvent } from '@nestjs/cqrs';

export interface ProductUpdatedPayload {
  id: string;
  name?: string;
  modelNumber?: string | null;
  categoryId?: string;
  manufacturerId?: string;
  updatedAt: Date;
}

export class ProductUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly modelNumber?: string | null;
  public readonly categoryId?: string;
  public readonly manufacturerId?: string;
  public readonly updatedAt: Date;

  constructor(payload: ProductUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
