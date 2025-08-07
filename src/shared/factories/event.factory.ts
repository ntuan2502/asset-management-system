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

type EventConstructor = new (...args: any[]) => IEvent;

const eventConstructors: { [key: string]: EventConstructor } = {
  [UserCreatedEvent.name]: UserCreatedEvent,
  [UserDeletedEvent.name]: UserDeletedEvent,
  [UserUpdatedEvent.name]: UserUpdatedEvent,
  [UserRestoredEvent.name]: UserRestoredEvent,
  [RoleCreatedEvent.name]: RoleCreatedEvent,
  [RoleUpdatedEvent.name]: RoleUpdatedEvent,
  [RoleDeletedEvent.name]: RoleDeletedEvent,
  [PermissionsAssignedToRoleEvent.name]: PermissionsAssignedToRoleEvent,
  [RoleAssignedToUserEvent.name]: RoleAssignedToUserEvent,
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
