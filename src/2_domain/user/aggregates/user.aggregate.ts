import {
  UserCreatedEvent,
  UserCreatedPayload,
} from '../events/user-created.event';
import { UserDeletedEvent } from '../events/user-deleted.event';
import {
  UserUpdatedEvent,
  UserUpdatedPayload,
} from '../events/user-updated.event';
import { UpdateUserInput } from 'src/1_application/user/dtos/update-user.input';
import { UserSnapshotDto } from './user-snapshot.dto';
import { UserRestoredEvent } from '../events/user-restored.event';
import { RoleAssignedToUserEvent } from '../events/role-assigned-to-user.event';
import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { AGGREGATE_TYPES } from 'src/shared/constants/aggregate-types.constants';
import { createId } from '@paralleldrive/cuid2';
import { UserOfficeChangedEvent } from '../events/user-office-changed.event';
import { UserDepartmentChangedEvent } from '../events/user-department-changed.event';
import { USER_ERRORS } from 'src/shared/constants/error-messages.constants';

export class UserAggregate extends BaseAggregateRoot {
  public readonly aggregateType = AGGREGATE_TYPES.USER;

  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public dob: Date | null;
  public gender: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;
  public roleIds: string[] = [];
  public officeId: string | null = null;
  public departmentId: string | null = null;

  public loadFromSnapshot(snapshot: UserSnapshotDto) {
    Object.assign(this, snapshot);
    this.version = snapshot.version;
  }

  protected onUserCreatedEvent(event: UserCreatedEvent) {
    this.id = event.id;
    this.email = event.email;
    this.password = event.hashedPassword;
    this.firstName = event.firstName;
    this.lastName = event.lastName;
    this.dob = event.dob ?? null;
    this.gender = event.gender ?? null;
    this.officeId = event.officeId ?? null;
    this.departmentId = event.departmentId ?? null;
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
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
  }

  protected onRoleAssignedToUserEvent(event: RoleAssignedToUserEvent) {
    if (!this.roleIds.includes(event.roleId)) {
      this.roleIds.push(event.roleId);
    }
    this.updatedAt = event.assignedAt;
    if (!this.getUncommittedEvents().some((e) => e === event)) {
      this.version++;
    }
  }

  protected onUserOfficeChangedEvent(event: UserOfficeChangedEvent) {
    this.officeId = event.newOfficeId;
    this.updatedAt = event.changedAt;
    this.version++;
  }

  protected onUserDepartmentChangedEvent(event: UserDepartmentChangedEvent) {
    this.departmentId = event.newDepartmentId;
    this.updatedAt = event.changedAt;
    this.version++;
  }

  public createUser(data: Omit<UserCreatedPayload, 'id' | 'createdAt'>) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new UserCreatedEvent({ id, ...data, createdAt }));
  }

  public updateUser(payload: UpdateUserInput) {
    if (this.deletedAt) {
      throw new Error(USER_ERRORS.CANNOT_UPDATE_DELETED);
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
    if (payload.officeId !== undefined && payload.officeId !== this.officeId) {
      this.changeOffice(payload.officeId);
    }
    if (
      payload.departmentId !== undefined &&
      payload.departmentId !== this.departmentId
    ) {
      this.changeDepartment(payload.departmentId);
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
      throw new Error(USER_ERRORS.ALREADY_DELETED);
    }
    this.apply(new UserDeletedEvent({ id: this.id }));
  }

  public restoreUser() {
    if (!this.deletedAt) {
      throw new Error(USER_ERRORS.IS_ACTIVE);
    }
    this.apply(new UserRestoredEvent({ id: this.id, restoredAt: new Date() }));
  }

  public assignRole(roleId: string) {
    if (this.roleIds.includes(roleId)) {
      return;
    }
    this.apply(
      new RoleAssignedToUserEvent({
        userId: this.id,
        roleId: roleId,
        assignedAt: new Date(),
      }),
    );
  }

  public changeOffice(newOfficeId: string | null) {
    if (this.officeId === newOfficeId) return;
    // Nếu đổi office, department cũ không còn hợp lệ -> reset
    if (this.departmentId) {
      this.changeDepartment(null);
    }
    this.apply(
      new UserOfficeChangedEvent({
        id: this.id,
        newOfficeId,
        changedAt: new Date(),
      }),
    );
  }

  public changeDepartment(newDepartmentId: string | null) {
    if (this.departmentId === newDepartmentId) return;
    this.apply(
      new UserDepartmentChangedEvent({
        id: this.id,
        newDepartmentId,
        changedAt: new Date(),
      }),
    );
  }
}
