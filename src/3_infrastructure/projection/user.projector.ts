import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event';
import { Gender, Prisma } from '@prisma/client';
import { UserRestoredEvent } from 'src/2_domain/user/events/user-restored.event';

@Injectable()
@EventsHandler(
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
  UserRestoredEvent,
)
export class UserProjector
  implements
    IEventHandler<
      UserCreatedEvent | UserDeletedEvent | UserUpdatedEvent | UserRestoredEvent
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async handle(
    event:
      | UserCreatedEvent
      | UserDeletedEvent
      | UserUpdatedEvent
      | UserRestoredEvent,
  ) {
    if (event instanceof UserCreatedEvent) {
      await this.onUserCreated(event);
    } else if (event instanceof UserUpdatedEvent) {
      await this.onUserUpdated(event);
    } else if (event instanceof UserDeletedEvent) {
      await this.onUserDeleted(event);
    } else if (event instanceof UserRestoredEvent) {
      await this.onUserRestored(event);
    }
  }

  private async onUserCreated(event: UserCreatedEvent): Promise<void> {
    console.log('Projector caught UserCreatedEvent:', event); // Thêm log để debug
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
  }

  private async onUserUpdated(event: UserUpdatedEvent): Promise<void> {
    console.log('Projector caught UserUpdatedEvent:', event);

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
  }
  private async onUserDeleted(event: UserDeletedEvent): Promise<void> {
    console.log('Projector caught UserDeletedEvent:', event);
    await this.prisma.user.update({
      where: {
        id: event.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private async onUserRestored(event: UserRestoredEvent): Promise<void> {
    console.log('Projector caught UserRestoredEvent:', event);
    await this.prisma.user.update({
      where: { id: event.id },
      data: {
        deletedAt: null,
        updatedAt: event.restoredAt,
      },
    });
  }
}
