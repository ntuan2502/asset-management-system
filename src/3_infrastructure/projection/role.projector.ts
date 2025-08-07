import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { RoleCreatedEvent } from 'src/2_domain/role/events/role-created.event';
import { PermissionsAssignedToRoleEvent } from 'src/2_domain/role/events/permissions-assigned-to-role.event';
import { RoleUpdatedEvent } from 'src/2_domain/role/events/role-updated.event';
import { RoleDeletedEvent } from 'src/2_domain/role/events/role-deleted.event';
import { Prisma } from '@prisma/client';

type RoleEvent =
  | RoleCreatedEvent
  | RoleUpdatedEvent
  | RoleDeletedEvent
  | PermissionsAssignedToRoleEvent;
@Injectable()
@EventsHandler(
  RoleCreatedEvent,
  RoleUpdatedEvent,
  RoleDeletedEvent,
  PermissionsAssignedToRoleEvent,
)
export class RoleProjector implements IEventHandler<RoleEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: RoleEvent) {
    console.log(
      `--- [PROJECTOR] Received event: ${event.constructor.name} ---`,
    );
    if (event instanceof RoleCreatedEvent) {
      console.log('Projector caught RoleCreatedEvent:', event);
      await this.prisma.role.create({
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
        },
      });
    } else if (event instanceof RoleUpdatedEvent) {
      await this.onRoleUpdated(event);
    } else if (event instanceof RoleDeletedEvent) {
      await this.onRoleDeleted(event);
    } else if (event instanceof PermissionsAssignedToRoleEvent) {
      await this.onPermissionsAssignedToRole(event);
    }
  }

  private async onPermissionsAssignedToRole(
    event: PermissionsAssignedToRoleEvent,
  ): Promise<void> {
    try {
      console.log('Projector caught PermissionsAssignedToRoleEvent:', event);
      await this.prisma.role.update({
        where: { id: event.roleId },
        data: {
          permissions: {
            set: event.permissionIds.map((id) => ({ id })),
          },
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully updated permissions for Role ${event.roleId} ---`,
      );
    } catch (error) {
      console.error('--- [PROJECTOR] ERROR updating permissions:', error);
    }
  }

  private async onRoleUpdated(event: RoleUpdatedEvent): Promise<void> {
    console.log('Projector caught RoleUpdatedEvent:', event);

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
    console.log(`--- [PROJECTOR] Successfully updated role ${event.id} ---`);
  }

  private async onRoleDeleted(event: RoleDeletedEvent): Promise<void> {
    await this.prisma.role.update({
      where: { id: event.id },
      data: { deletedAt: event.deletedAt },
    });
  }
}
