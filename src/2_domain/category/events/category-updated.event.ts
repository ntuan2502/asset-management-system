import { IEvent } from '@nestjs/cqrs';

export interface CategoryUpdatedPayload {
  id: string;
  name?: string;
  updatedAt: Date;
}

export class CategoryUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly updatedAt: Date;

  constructor(payload: CategoryUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
