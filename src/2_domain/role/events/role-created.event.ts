import { IEvent } from '@nestjs/cqrs';

export interface RoleCreatedPayload {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export class RoleCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string | null;
  public readonly createdAt: Date;

  constructor(payload: RoleCreatedPayload) {
    Object.assign(this, payload);

    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
