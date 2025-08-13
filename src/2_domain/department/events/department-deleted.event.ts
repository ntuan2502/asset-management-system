import { IEvent } from '@nestjs/cqrs';

export interface DepartmentDeletedPayload {
  id: string;
  deletedAt: Date;
}

export class DepartmentDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;

  constructor(payload: DepartmentDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
