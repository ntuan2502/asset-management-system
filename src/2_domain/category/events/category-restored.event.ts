import { IEvent } from '@nestjs/cqrs';

export interface CategoryRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class CategoryRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: CategoryRestoredPayload) {
    Object.assign(this, payload);
    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
