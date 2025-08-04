import { IEvent } from '@nestjs/cqrs';

export interface RoleAssignedToUserPayload {
  userId: string;
  roleId: string;
  assignedAt: Date;
}

export class RoleAssignedToUserEvent implements IEvent {
  public readonly userId: string;
  public readonly roleId: string;
  public readonly assignedAt: Date;

  constructor(payload: RoleAssignedToUserPayload) {
    Object.assign(this, payload);
    if (this.assignedAt) {
      this.assignedAt = new Date(this.assignedAt);
    }
  }
}
