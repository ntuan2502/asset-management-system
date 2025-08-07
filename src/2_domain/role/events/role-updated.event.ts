import { IEvent } from '@nestjs/cqrs';

export interface RoleUpdatedPayload {
  id: string;
  name?: string;
  description?: string | null;
  updatedAt: Date;
}

export class RoleUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly description?: string | null;
  public readonly updatedAt: Date;

  constructor(payload: RoleUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
