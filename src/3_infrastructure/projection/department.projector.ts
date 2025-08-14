import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { DepartmentCreatedEvent } from 'src/2_domain/department/events/department-created.event';
import { DepartmentUpdatedEvent } from 'src/2_domain/department/events/department-updated.event';
import { Prisma } from '@prisma/client';
import { DepartmentDeletedEvent } from 'src/2_domain/department/events/department-deleted.event';
import { DepartmentRestoredEvent } from 'src/2_domain/department/events/department-restored.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';

type DepartmentEvent =
  | DepartmentCreatedEvent
  | DepartmentUpdatedEvent
  | DepartmentDeletedEvent
  | DepartmentRestoredEvent;
@Injectable()
@EventsHandler(
  DepartmentCreatedEvent,
  DepartmentUpdatedEvent,
  DepartmentDeletedEvent,
  DepartmentRestoredEvent,
)
export class DepartmentProjector implements IEventHandler<DepartmentEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: DepartmentEvent) {
    if (event instanceof DepartmentCreatedEvent) {
      await this.onDepartmentCreated(event);
    } else if (event instanceof DepartmentUpdatedEvent) {
      await this.onDepartmentUpdated(event);
    } else if (event instanceof DepartmentDeletedEvent) {
      await this.onDepartmentDeleted(event);
    } else if (event instanceof DepartmentRestoredEvent) {
      await this.onDepartmentRestored(event);
    }
  }
  private async onDepartmentCreated(
    event: DepartmentCreatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.DEPARTMENT_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.department.create({
        data: {
          id: event.id,
          name: event.name,
          officeId: event.officeId,
          description: event.description,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onDepartmentUpdated(
    event: DepartmentUpdatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.DEPARTMENT_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.DepartmentUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }
      if (event.description !== undefined) {
        dataToUpdate.description = event.description;
      }
      await this.prisma.department.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onDepartmentDeleted(
    event: DepartmentDeletedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.DEPARTMENT_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.department.update({
        where: { id: event.id },
        data: {
          deletedAt: event.deletedAt,
          updatedAt: event.deletedAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onDepartmentRestored(
    event: DepartmentRestoredEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.DEPARTMENT_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.department.update({
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
}
