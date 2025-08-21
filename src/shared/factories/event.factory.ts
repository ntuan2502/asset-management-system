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
import { StatusLabelCreatedEvent } from 'src/2_domain/status-label/events/status-label-created.event';
import { StatusLabelUpdatedEvent } from 'src/2_domain/status-label/events/status-label-updated.event';
import { StatusLabelDeletedEvent } from 'src/2_domain/status-label/events/status-label-deleted.event';
import { StatusLabelRestoredEvent } from 'src/2_domain/status-label/events/status-label-restored.event';
import { CategoryCreatedEvent } from 'src/2_domain/category/events/category-created.event';
import { CategoryUpdatedEvent } from 'src/2_domain/category/events/category-updated.event';
import { CategoryDeletedEvent } from 'src/2_domain/category/events/category-deleted.event';
import { CategoryRestoredEvent } from 'src/2_domain/category/events/category-restored.event';
import { ManufacturerCreatedEvent } from 'src/2_domain/manufacturer/events/manufacturer-created.event';
import { ManufacturerUpdatedEvent } from 'src/2_domain/manufacturer/events/manufacturer-updated.event';
import { ManufacturerDeletedEvent } from 'src/2_domain/manufacturer/events/manufacturer-deleted.event';
import { ManufacturerRestoredEvent } from 'src/2_domain/manufacturer/events/manufacturer-restored.event';
import { AttributeCreatedEvent } from 'src/2_domain/attribute/events/attribute-created.event';
import { AttributeUpdatedEvent } from 'src/2_domain/attribute/events/attribute-updated.event';
import { AttributeDeletedEvent } from 'src/2_domain/attribute/events/attribute-deleted.event';
import { AttributeRestoredEvent } from 'src/2_domain/attribute/events/attribute-restored.event';

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

  [StatusLabelCreatedEvent.name]: StatusLabelCreatedEvent,
  [StatusLabelUpdatedEvent.name]: StatusLabelUpdatedEvent,
  [StatusLabelDeletedEvent.name]: StatusLabelDeletedEvent,
  [StatusLabelRestoredEvent.name]: StatusLabelRestoredEvent,

  [CategoryCreatedEvent.name]: CategoryCreatedEvent,
  [CategoryUpdatedEvent.name]: CategoryUpdatedEvent,
  [CategoryDeletedEvent.name]: CategoryDeletedEvent,
  [CategoryRestoredEvent.name]: CategoryRestoredEvent,

  [ManufacturerCreatedEvent.name]: ManufacturerCreatedEvent,
  [ManufacturerUpdatedEvent.name]: ManufacturerUpdatedEvent,
  [ManufacturerDeletedEvent.name]: ManufacturerDeletedEvent,
  [ManufacturerRestoredEvent.name]: ManufacturerRestoredEvent,

  [AttributeCreatedEvent.name]: AttributeCreatedEvent,
  [AttributeUpdatedEvent.name]: AttributeUpdatedEvent,
  [AttributeDeletedEvent.name]: AttributeDeletedEvent,
  [AttributeRestoredEvent.name]: AttributeRestoredEvent,
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
