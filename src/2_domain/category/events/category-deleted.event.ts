import { IEvent } from '@nestjs/cqrs';

export interface CategoryDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class CategoryDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: CategoryDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
