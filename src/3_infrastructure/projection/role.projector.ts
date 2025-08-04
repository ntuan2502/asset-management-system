import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { RoleCreatedEvent } from 'src/2_domain/role/events/role-created.event';
import { PermissionsAssignedToRoleEvent } from 'src/2_domain/role/events/permissions-assigned-to-role.event';

@Injectable()
@EventsHandler(RoleCreatedEvent)
export class RoleProjector implements IEventHandler<RoleCreatedEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: RoleCreatedEvent | PermissionsAssignedToRoleEvent) {
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
    console.log('Projector caught PermissionsAssignedToRoleEvent:', event);
    await this.prisma.role.update({
      where: { id: event.roleId },
      data: {
        // Prisma cho phép dùng `set` để thay thế hoàn toàn danh sách quan hệ
        permissions: {
          set: event.permissionIds.map((id) => ({ id })),
        },
      },
    });
  }
}
