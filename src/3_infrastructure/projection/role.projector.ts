import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { RoleCreatedEvent } from 'src/2_domain/role/events/role-created.event';
import { PermissionsAssignedToRoleEvent } from 'src/2_domain/role/events/permissions-assigned-to-role.event';
import { RoleUpdatedEvent } from 'src/2_domain/role/events/role-updated.event';
import { RoleDeletedEvent } from 'src/2_domain/role/events/role-deleted.event';
import { Prisma } from '@prisma/client';
import { RoleRestoredEvent } from 'src/2_domain/role/events/role-restored.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';

type RoleEvent =
  | RoleCreatedEvent
  | RoleUpdatedEvent
  | RoleDeletedEvent
  | RoleRestoredEvent
  | PermissionsAssignedToRoleEvent;
@Injectable()
@EventsHandler(
  RoleCreatedEvent,
  RoleUpdatedEvent,
  RoleDeletedEvent,
  RoleRestoredEvent,
  PermissionsAssignedToRoleEvent,
)
export class RoleProjector implements IEventHandler<RoleEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: RoleEvent) {
    if (event instanceof RoleCreatedEvent) {
      await this.onRoleCreated(event);
    } else if (event instanceof RoleUpdatedEvent) {
      await this.onRoleUpdated(event);
    } else if (event instanceof RoleDeletedEvent) {
      await this.onRoleDeleted(event);
    } else if (event instanceof RoleRestoredEvent) {
      await this.onRoleRestored(event);
    } else if (event instanceof PermissionsAssignedToRoleEvent) {
      await this.onPermissionsAssignedToRole(event);
    }
  }

  private async onRoleCreated(event: RoleCreatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.ROLE_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.role.create({
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onRoleUpdated(event: RoleUpdatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.ROLE_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.RoleUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }
      if (event.description !== undefined) {
        dataToUpdate.description = event.description;
      }

      await this.prisma.role.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onRoleDeleted(event: RoleDeletedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.ROLE_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.role.update({
        where: { id: event.id },
        data: { deletedAt: event.deletedAt },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onRoleRestored(event: RoleRestoredEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.ROLE_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.role.update({
        where: { id: event.id },
        data: {
          deletedAt: null,
          updatedAt: event.restoredAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onPermissionsAssignedToRole(
    event: PermissionsAssignedToRoleEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.PERMISSIONS_ASSIGNED_TO_ROLE;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.role.update({
        where: { id: event.roleId },
        data: {
          permissions: {
            set: event.permissionIds.map((id) => ({ id })),
          },
        },
      });
      console.log(logs.SUCCESS(event.roleId));
    } catch (error) {
      console.error(logs.ERROR(event.roleId), error);
    }
  }
}
