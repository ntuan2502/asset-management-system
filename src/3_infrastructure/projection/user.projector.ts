import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event';
import { Gender, Prisma } from '@prisma/client';
import { UserRestoredEvent } from 'src/2_domain/user/events/user-restored.event';
import { RoleAssignedToUserEvent } from 'src/2_domain/user/events/role-assigned-to-user.event';
import { UserOfficeChangedEvent } from 'src/2_domain/user/events/user-office-changed.event';
import { UserDepartmentChangedEvent } from 'src/2_domain/user/events/user-department-changed.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';

type UserEvent =
  | UserCreatedEvent
  | UserDeletedEvent
  | UserUpdatedEvent
  | UserRestoredEvent
  | RoleAssignedToUserEvent
  | UserOfficeChangedEvent
  | UserDepartmentChangedEvent;
@Injectable()
@EventsHandler(
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
  UserRestoredEvent,
  RoleAssignedToUserEvent,
  UserOfficeChangedEvent,
  UserDepartmentChangedEvent,
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
    } else if (event instanceof UserOfficeChangedEvent) {
      await this.onUserOfficeChanged(event);
    } else if (event instanceof UserDepartmentChangedEvent) {
      await this.onUserDepartmentChanged(event);
    }
  }

  private async onUserCreated(event: UserCreatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.create({
        data: {
          id: event.id,
          email: event.email,
          password: event.hashedPassword,
          firstName: event.firstName,
          lastName: event.lastName,
          dob: event.dob,
          gender: event.gender ? (event.gender as Gender) : null,
          officeId: event.officeId,
          departmentId: event.departmentId,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onUserUpdated(event: UserUpdatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
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
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }
  private async onUserDeleted(event: UserDeletedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.update({
        where: {
          id: event.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onUserRestored(event: UserRestoredEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.update({
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

  private async onRoleAssignedToUser(
    event: RoleAssignedToUserEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.ROLE_ASSIGNED_TO_USER;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.update({
        where: { id: event.userId },
        data: {
          roles: {
            connect: { id: event.roleId },
          },
          updatedAt: event.assignedAt,
        },
      });
      console.log(logs.SUCCESS(event.userId, event.roleId));
    } catch (error) {
      console.error(logs.ERROR(event.userId, event.roleId), error);
    }
  }

  private async onUserOfficeChanged(
    event: UserOfficeChangedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_OFFICE_CHANGED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.update({
        where: { id: event.id },
        data: {
          office: event.newOfficeId
            ? { connect: { id: event.newOfficeId } }
            : { disconnect: true },
          updatedAt: event.changedAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onUserDepartmentChanged(
    event: UserDepartmentChangedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.USER_DEPARTMENT_CHANGED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.user.update({
        where: { id: event.id },
        data: {
          department: event.newDepartmentId
            ? { connect: { id: event.newDepartmentId } }
            : { disconnect: true },
          updatedAt: event.changedAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }
}
