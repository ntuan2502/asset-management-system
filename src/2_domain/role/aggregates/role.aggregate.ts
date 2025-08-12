import { createId } from '@paralleldrive/cuid2';
import { RoleCreatedEvent } from '../events/role-created.event';
import { PermissionsAssignedToRoleEvent } from '../events/permissions-assigned-to-role.event';
import {
  RoleUpdatedEvent,
  RoleUpdatedPayload,
} from '../events/role-updated.event';
import { RoleDeletedEvent } from '../events/role-deleted.event';
import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { AGGREGATE_TYPES } from 'src/shared/constants/aggregate-types.constants';

export class RoleAggregate extends BaseAggregateRoot {
  public readonly aggregateType = AGGREGATE_TYPES.ROLE;

  public name: string;
  public description: string | null = null;
  public permissionIds: string[] = [];
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public assignPermissions(permissionIds: string[]) {
    const newPermissionIds = [...new Set(permissionIds)];

    const currentIds = new Set(this.permissionIds);
    const incomingIds = new Set(newPermissionIds);

    if (
      currentIds.size === incomingIds.size &&
      [...currentIds].every((id) => incomingIds.has(id))
    ) {
      return;
    }

    this.apply(
      new PermissionsAssignedToRoleEvent({
        roleId: this.id,
        permissionIds: newPermissionIds,
        assignedAt: new Date(),
      }),
    );
  }

  public createRole(name: string, description?: string | null) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new RoleCreatedEvent({ id, name, description, createdAt }));
  }

  public updateRole(payload: { name?: string; description?: string | null }) {
    const changes: Partial<RoleUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }
    if (
      payload.description !== undefined &&
      payload.description !== this.description
    ) {
      changes.description = payload.description;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    this.apply(
      new RoleUpdatedEvent({
        ...changes,
        id: this.id,
        updatedAt: new Date(),
      }),
    );
  }

  public deleteRole() {
    if (this.deletedAt) {
      throw new Error('Cannot delete a role that has already been deleted.');
    }
    this.apply(new RoleDeletedEvent({ id: this.id, deletedAt: new Date() }));
  }

  protected onPermissionsAssignedToRoleEvent(
    event: PermissionsAssignedToRoleEvent,
  ) {
    this.permissionIds = event.permissionIds;
    this.updatedAt = event.assignedAt;
    this.version++;
  }

  protected onRoleCreatedEvent(event: RoleCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.description = event.description ?? null;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onRoleUpdatedEvent(event: RoleUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    if (event.description !== undefined) {
      this.description = event.description;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }

  protected onRoleDeletedEvent(event: RoleDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }
}
