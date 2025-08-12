import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event';
import { Gender, Prisma } from '@prisma/client';
import { UserRestoredEvent } from 'src/2_domain/user/events/user-restored.event';
import { RoleAssignedToUserEvent } from 'src/2_domain/user/events/role-assigned-to-user.event';

type UserEvent =
  | UserCreatedEvent
  | UserDeletedEvent
  | UserUpdatedEvent
  | UserRestoredEvent
  | RoleAssignedToUserEvent;
@Injectable()
@EventsHandler(
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
  UserRestoredEvent,
  RoleAssignedToUserEvent,
)
export class UserProjector implements IEventHandler<UserEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: UserEvent) {
    if (event instanceof UserCreatedEvent) {
      await this.onUserCreated(event);
    } else if (event instanceof UserUpdatedEvent) {
      await this.onUserUpdated(event);
    } else if (event instanceof UserDeletedEvent) {
      await this.onUserDeleted(event);
    } else if (event instanceof UserRestoredEvent) {
      await this.onUserRestored(event);
    } else if (event instanceof RoleAssignedToUserEvent) {
      await this.onRoleAssignedToUser(event);
    }
  }

  private async onUserCreated(event: UserCreatedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received UserCreatedEvent ---', event);
      await this.prisma.user.create({
        data: {
          id: event.id,
          email: event.email,
          password: event.hashedPassword,
          firstName: event.firstName,
          lastName: event.lastName,
          dob: event.dob,
          gender: event.gender ? (event.gender as Gender) : null,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(`--- [PROJECTOR] Successfully created user ${event.id} ---`);
    } catch (error) {
      console.error(`--- [PROJECTOR] ERROR creating user ${event.id}:`, error);
    }
  }

  private async onUserUpdated(event: UserUpdatedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received UserUpdatedEvent ---', event);
      const dataToUpdate: Prisma.UserUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.firstName !== undefined) {
        dataToUpdate.firstName = event.firstName;
      }
      if (event.lastName !== undefined) {
        dataToUpdate.lastName = event.lastName;
      }
      if (event.dob !== undefined) {
        dataToUpdate.dob = event.dob;
      }
      if (event.gender !== undefined) {
        dataToUpdate.gender = event.gender ? (event.gender as Gender) : null;
      }

      await this.prisma.user.update({
        where: {
          id: event.id,
        },
        data: dataToUpdate,
      });
      console.log(`--- [PROJECTOR] Successfully updated user ${event.id} ---`);
    } catch (error) {
      console.error(`--- [PROJECTOR] ERROR updating user ${event.id}:`, error);
    }
  }
  private async onUserDeleted(event: UserDeletedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received UserDeletedEvent ---', event);
      await this.prisma.user.update({
        where: {
          id: event.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      console.log(`--- [PROJECTOR] Successfully deleted user ${event.id} ---`);
    } catch (error) {
      console.error(`--- [PROJECTOR] ERROR deleting user ${event.id}:`, error);
    }
  }

  private async onUserRestored(event: UserRestoredEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received UserRestoredEvent ---', event);
      await this.prisma.user.update({
        where: { id: event.id },
        data: {
          deletedAt: null,
          updatedAt: event.restoredAt,
        },
      });
      console.log(`--- [PROJECTOR] Successfully restored user ${event.id} ---`);
    } catch (error) {
      console.error(`--- [PROJECTOR] ERROR restoring user ${event.id}:`, error);
    }
  }

  private async onRoleAssignedToUser(
    event: RoleAssignedToUserEvent,
  ): Promise<void> {
    try {
      console.log(
        '--- [PROJECTOR] Received RoleAssignedToUserEvent ---',
        event,
      );
      await this.prisma.user.update({
        where: { id: event.userId },
        data: {
          roles: {
            connect: { id: event.roleId },
          },
          updatedAt: event.assignedAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully assigned role ${event.roleId} to user ${event.userId} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR assigning role ${event.roleId} to user ${event.userId}:`,
        error,
      );
    }
  }
}
