import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { StatusLabelCreatedEvent } from 'src/2_domain/status-label/events/status-label-created.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';
import { StatusLabelUpdatedEvent } from 'src/2_domain/status-label/events/status-label-updated.event';
import { StatusLabelDeletedEvent } from 'src/2_domain/status-label/events/status-label-deleted.event';
import { StatusLabelRestoredEvent } from 'src/2_domain/status-label/events/status-label-restored.event';
import { Prisma } from '@prisma/client';

type StatusLabelEvent =
  | StatusLabelCreatedEvent
  | StatusLabelUpdatedEvent
  | StatusLabelDeletedEvent
  | StatusLabelRestoredEvent;

@Injectable()
@EventsHandler(
  StatusLabelCreatedEvent,
  StatusLabelUpdatedEvent,
  StatusLabelDeletedEvent,
  StatusLabelRestoredEvent,
)
export class StatusLabelProjector implements IEventHandler<StatusLabelEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: StatusLabelEvent) {
    if (event instanceof StatusLabelCreatedEvent) {
      await this.onStatusLabelCreated(event);
    } else if (event instanceof StatusLabelUpdatedEvent) {
      await this.onStatusLabelUpdated(event);
    } else if (event instanceof StatusLabelDeletedEvent) {
      await this.onStatusLabelDeleted(event);
    } else if (event instanceof StatusLabelRestoredEvent) {
      await this.onStatusLabelRestored(event);
    }
  }

  private async onStatusLabelCreated(
    event: StatusLabelCreatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.STATUS_LABEL_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.statusLabel.create({
        data: {
          id: event.id,
          name: event.name,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onStatusLabelUpdated(
    event: StatusLabelUpdatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.STATUS_LABEL_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.StatusLabelUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
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

  private async onStatusLabelDeleted(
    event: StatusLabelDeletedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.STATUS_LABEL_DELETED;
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

  private async onStatusLabelRestored(
    event: StatusLabelRestoredEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.STATUS_LABEL_RESTORED;
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
