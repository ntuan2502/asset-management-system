import { IEvent } from '@nestjs/cqrs';

export interface CategoryCreatedPayload {
  id: string;
  name: string;
  createdAt: Date;
}

export class CategoryCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;

  constructor(payload: CategoryCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
