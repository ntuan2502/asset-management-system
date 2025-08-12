import { IEvent } from '@nestjs/cqrs';

export type OfficeDeletedPayload = {
  id: string;
  deletedAt: Date;
};

export class OfficeDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: OfficeDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
