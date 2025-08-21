import { IEvent } from '@nestjs/cqrs';

export interface AttributeDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class AttributeDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: AttributeDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
