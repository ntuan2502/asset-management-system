import { IEvent } from '@nestjs/cqrs';

export interface PermissionsAssignedToRolePayload {
  roleId: string;
  permissionIds: string[];
  assignedAt: Date;
}

export class PermissionsAssignedToRoleEvent implements IEvent {
  public readonly roleId: string;
  public readonly permissionIds: string[];
  public readonly assignedAt: Date;

  constructor(payload: PermissionsAssignedToRolePayload) {
    Object.assign(this, payload);

    if (this.assignedAt) {
      this.assignedAt = new Date(this.assignedAt);
    }
  }
}
