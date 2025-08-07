import { IEvent } from '@nestjs/cqrs';
export interface RoleDeletedPayload {
  id: string;
  deletedAt: Date;
}
export class RoleDeletedEvent implements IEvent {
  public readonly id: string;
  public readonly deletedAt: Date;
  constructor(payload: RoleDeletedPayload) {
    Object.assign(this, payload);
    if (this.deletedAt) {
      this.deletedAt = new Date(this.deletedAt);
    }
  }
}
