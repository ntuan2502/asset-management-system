import { IEvent } from '@nestjs/cqrs';

export interface DepartmentCreatedPayload {
  id: string;
  name: string;
  officeId: string;
  description?: string | null;
  createdAt: Date;
}

export class DepartmentCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly officeId: string;
  public readonly description?: string | null;
  public readonly createdAt: Date;

  constructor(payload: DepartmentCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
