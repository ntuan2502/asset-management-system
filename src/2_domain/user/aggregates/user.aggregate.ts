import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserDeletedEvent } from '../events/user-deleted.event';
import {
  UserUpdatedEvent,
  UserUpdatedPayload,
} from '../events/user-updated.event'; // << IMPORT SỰ KIỆN MỚI
import { UpdateUserInput } from 'src/1_application/user/dtos/update-user.input'; // << IMPORT DTO
import { UserSnapshotDto } from './user-snapshot.dto';
import { UserRestoredEvent } from '../events/user-restored.event';
import { RoleAssignedToUserEvent } from '../events/role-assigned-to-user.event';

export class UserAggregate extends AggregateRoot {
  public id: string;
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public dob: Date | null;
  public gender: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;
  public version = 0;
  public roleIds: string[] = []; // << THÊM MỚI

  constructor() {
    super();
  }

  public loadFromSnapshot(snapshot: UserSnapshotDto) {
    Object.assign(this, snapshot);
    this.version = snapshot.version;
  }

  public loadFromHistory(history: IEvent[]) {
    history.forEach((event) => this.apply(event, true));
  }

  protected onUserCreatedEvent(event: UserCreatedEvent) {
    this.id = event.id;
    this.email = event.email;
    this.password = event.hashedPassword;
    this.firstName = event.firstName;
    this.lastName = event.lastName;
    this.dob = event.dob ?? null;
    this.gender = event.gender ?? null;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
  }

  protected onUserUpdatedEvent(event: UserUpdatedEvent) {
    if (event.firstName !== undefined) {
      this.firstName = event.firstName;
    }
    if (event.lastName !== undefined) {
      this.lastName = event.lastName;
    }
    if (event.dob !== undefined) {
      this.dob = event.dob;
    }
    if (event.gender !== undefined) {
      this.gender = event.gender;
    }
    this.updatedAt = event.updatedAt;
  }

  protected onUserDeletedEvent(_event: UserDeletedEvent) {
    this.deletedAt = new Date();
  }

  protected onUserRestoredEvent(event: UserRestoredEvent) {
    // Hành động chính là set deletedAt về null
    this.deletedAt = null;
    // Cập nhật lại updatedAt
    this.updatedAt = event.restoredAt;
  }

  protected onRoleAssignedToUserEvent(event: RoleAssignedToUserEvent) {
    this.roleIds.push(event.roleId);
    this.updatedAt = event.assignedAt;
    // Tăng version chỉ khi có sự kiện mới được apply (không phải từ history)
    if (!this.getUncommittedEvents().some((e) => e === event)) {
      this.version++;
    }
  }

  public createUser(
    id: string,
    email: string,
    hashedPassword: string,
    firstName: string,
    lastName: string,
    dob?: Date | null,
    gender?: string | null,
  ) {
    const createdAt = new Date();
    this.apply(
      new UserCreatedEvent({
        id,
        email,
        hashedPassword,
        firstName,
        lastName,
        dob,
        gender,
        createdAt,
      }),
    );
  }
  public updateInfo(payload: UpdateUserInput) {
    if (this.deletedAt) {
      throw new Error('Cannot update a deleted user.');
    }

    const changes: Partial<UserUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.firstName && payload.firstName !== this.firstName) {
      changes.firstName = payload.firstName;
      hasChanges = true;
    }
    if (payload.lastName && payload.lastName !== this.lastName) {
      changes.lastName = payload.lastName;
      hasChanges = true;
    }
    if (
      payload.dob !== undefined &&
      payload.dob?.getTime() !== this.dob?.getTime()
    ) {
      changes.dob = payload.dob;
      hasChanges = true;
    }
    if (payload.gender !== undefined && payload.gender !== this.gender) {
      changes.gender = payload.gender;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    const eventPayload: UserUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new UserUpdatedEvent(eventPayload));
  }

  public deleteUser() {
    if (this.deletedAt) {
      throw new Error('Cannot delete a user that has already been deleted.');
    }
    this.apply(new UserDeletedEvent({ id: this.id }));
  }

  public restore() {
    if (!this.deletedAt) {
      throw new Error('Cannot restore an active user.');
    }
    this.apply(new UserRestoredEvent({ id: this.id, restoredAt: new Date() }));
  }

  public assignRole(roleId: string) {
    // Quy tắc nghiệp vụ: Không gán lại vai trò đã có
    if (this.roleIds.includes(roleId)) {
      return; // Hoặc ném lỗi nếu muốn
    }
    this.apply(
      new RoleAssignedToUserEvent({
        userId: this.id,
        roleId: roleId,
        assignedAt: new Date(),
      }),
    );
  }
}
