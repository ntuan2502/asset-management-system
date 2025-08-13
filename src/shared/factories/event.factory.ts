import { IEvent } from '@nestjs/cqrs';
import { StoredEvent } from 'src/3_infrastructure/event-store/event-store.interface';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event';
import { UserRestoredEvent } from 'src/2_domain/user/events/user-restored.event';
import { RoleCreatedEvent } from 'src/2_domain/role/events/role-created.event';
import { PermissionsAssignedToRoleEvent } from 'src/2_domain/role/events/permissions-assigned-to-role.event';
import { RoleAssignedToUserEvent } from 'src/2_domain/user/events/role-assigned-to-user.event';
import { RoleUpdatedEvent } from 'src/2_domain/role/events/role-updated.event';
import { RoleDeletedEvent } from 'src/2_domain/role/events/role-deleted.event';
import { OfficeCreatedEvent } from 'src/2_domain/office/events/office-created.event';
import { OfficeUpdatedEvent } from 'src/2_domain/office/events/office-updated.event';
import { OfficeDeletedEvent } from 'src/2_domain/office/events/office-deleted.event';
import { OfficeRestoredEvent } from 'src/2_domain/office/events/office-restored.event';
import { RoleRestoredEvent } from 'src/2_domain/role/events/role-restored.event';
import { DepartmentCreatedEvent } from 'src/2_domain/department/events/department-created.event';
import { DepartmentUpdatedEvent } from 'src/2_domain/department/events/department-updated.event';
import { DepartmentDeletedEvent } from 'src/2_domain/department/events/department-deleted.event';
import { DepartmentRestoredEvent } from 'src/2_domain/department/events/department-restored.event';
import { UserOfficeChangedEvent } from 'src/2_domain/user/events/user-office-changed.event';
import { UserDepartmentChangedEvent } from 'src/2_domain/user/events/user-department-changed.event';

type EventConstructor = new (...args: any[]) => IEvent;

const eventConstructors: { [key: string]: EventConstructor } = {
  [UserCreatedEvent.name]: UserCreatedEvent,
  [UserDeletedEvent.name]: UserDeletedEvent,
  [UserUpdatedEvent.name]: UserUpdatedEvent,
  [UserRestoredEvent.name]: UserRestoredEvent,
  [UserOfficeChangedEvent.name]: UserOfficeChangedEvent,
  [UserDepartmentChangedEvent.name]: UserDepartmentChangedEvent,

  [RoleCreatedEvent.name]: RoleCreatedEvent,
  [RoleUpdatedEvent.name]: RoleUpdatedEvent,
  [RoleDeletedEvent.name]: RoleDeletedEvent,
  [RoleRestoredEvent.name]: RoleRestoredEvent,
  [PermissionsAssignedToRoleEvent.name]: PermissionsAssignedToRoleEvent,
  [RoleAssignedToUserEvent.name]: RoleAssignedToUserEvent,

  [OfficeCreatedEvent.name]: OfficeCreatedEvent,
  [OfficeUpdatedEvent.name]: OfficeUpdatedEvent,
  [OfficeDeletedEvent.name]: OfficeDeletedEvent,
  [OfficeRestoredEvent.name]: OfficeRestoredEvent,

  [DepartmentCreatedEvent.name]: DepartmentCreatedEvent,
  [DepartmentUpdatedEvent.name]: DepartmentUpdatedEvent,
  [DepartmentDeletedEvent.name]: DepartmentDeletedEvent,
  [DepartmentRestoredEvent.name]: DepartmentRestoredEvent,
};

export class EventFactory {
  public static create(storedEvent: StoredEvent): IEvent {
    const constructor = eventConstructors[storedEvent.eventType];
    if (!constructor) {
      throw new Error(`Event type ${storedEvent.eventType} not recognized.`);
    }

    return new constructor(storedEvent.payload);
  }

  public static fromHistory(history: StoredEvent[]): IEvent[] {
    return history.map((event) => this.create(event));
  }
}
