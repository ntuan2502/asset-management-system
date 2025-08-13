import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { DepartmentCreatedEvent } from 'src/2_domain/department/events/department-created.event';
import { DepartmentUpdatedEvent } from 'src/2_domain/department/events/department-updated.event';
import { Prisma } from '@prisma/client';
import { DepartmentDeletedEvent } from 'src/2_domain/department/events/department-deleted.event';
import { DepartmentRestoredEvent } from 'src/2_domain/department/events/department-restored.event';

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
    try {
      console.log('--- [PROJECTOR] Received DepartmentCreatedEvent ---', event);
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
      console.log(
        `--- [PROJECTOR] Successfully created department ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR creating department ${event.id}:`,
        error,
      );
    }
  }

  private async onDepartmentUpdated(
    event: DepartmentUpdatedEvent,
  ): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received DepartmentUpdatedEvent ---', event);
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
      console.log(
        `--- [PROJECTOR] Successfully updated department ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR updating department ${event.id}:`,
        error,
      );
    }
  }

  private async onDepartmentDeleted(
    event: DepartmentDeletedEvent,
  ): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Soft-deleting department ---', event);
      await this.prisma.department.update({
        where: { id: event.id },
        data: {
          deletedAt: event.deletedAt,
          updatedAt: event.deletedAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully soft-deleted department ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR soft-deleting department ${event.id}:`,
        error,
      );
    }
  }

  private async onDepartmentRestored(
    event: DepartmentRestoredEvent,
  ): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Restoring department ---', event);
      await this.prisma.department.update({
        where: { id: event.id },
        data: {
          deletedAt: null,
          updatedAt: event.restoredAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully restored department ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR restoring department ${event.id}:`,
        error,
      );
    }
  }
}
