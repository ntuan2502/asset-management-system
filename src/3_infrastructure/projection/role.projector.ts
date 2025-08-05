import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { RoleCreatedEvent } from 'src/2_domain/role/events/role-created.event';
import { PermissionsAssignedToRoleEvent } from 'src/2_domain/role/events/permissions-assigned-to-role.event';

@Injectable()
@EventsHandler(RoleCreatedEvent, PermissionsAssignedToRoleEvent)
export class RoleProjector
  implements IEventHandler<RoleCreatedEvent | PermissionsAssignedToRoleEvent>
{
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: RoleCreatedEvent | PermissionsAssignedToRoleEvent) {
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
}
