import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import * as cuid from 'cuid';
import { RoleCreatedEvent } from '../events/role-created.event';
import { PermissionsAssignedToRoleEvent } from '../events/permissions-assigned-to-role.event';

export class RoleAggregate extends AggregateRoot {
  public id: string;
  public name: string;
  public description: string | null = null;
  public permissionIds: string[] = []; // Sẽ dùng sau, khởi tạo rỗng
  public createdAt: Date;
  public updatedAt: Date;
  public version = 0;

  public createRole(name: string, description?: string | null) {
    const id = cuid();
    const createdAt = new Date();
    this.apply(new RoleCreatedEvent({ id, name, description, createdAt }));
  }

  public loadFromHistory(history: IEvent[]) {
    history.forEach((event) => this.apply(event, true));
  }

  public assignPermissions(permissionIds: string[]) {
    // Sử dụng Set để loại bỏ các ID trùng lặp và dễ dàng so sánh
    const newPermissionIds = [...new Set(permissionIds)];

    // Quy tắc nghiệp vụ: Chỉ phát ra sự kiện nếu danh sách quyền thực sự thay đổi
    const currentIds = new Set(this.permissionIds);
    const incomingIds = new Set(newPermissionIds);

    if (
      currentIds.size === incomingIds.size &&
      [...currentIds].every((id) => incomingIds.has(id))
    ) {
      // Không có gì thay đổi, không làm gì cả
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
}
