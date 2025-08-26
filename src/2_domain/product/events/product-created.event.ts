import { IEvent } from '@nestjs/cqrs';

export interface ProductCreatedPayload {
  id: string;
  name: string;
  modelNumber?: string | null;
  categoryId: string;
  manufacturerId: string;
  createdAt: Date;
}

export class ProductCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly modelNumber?: string | null;
  public readonly categoryId: string;
  public readonly manufacturerId: string;
  public readonly createdAt: Date;

  constructor(payload: ProductCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
