import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ManufacturerCreatedEvent } from 'src/2_domain/manufacturer/events/manufacturer-created.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';
import { ManufacturerUpdatedEvent } from 'src/2_domain/manufacturer/events/manufacturer-updated.event';
import { ManufacturerDeletedEvent } from 'src/2_domain/manufacturer/events/manufacturer-deleted.event';
import { ManufacturerRestoredEvent } from 'src/2_domain/manufacturer/events/manufacturer-restored.event';
import { Prisma } from '@prisma/client';

type ManufacturerEvent =
  | ManufacturerCreatedEvent
  | ManufacturerUpdatedEvent
  | ManufacturerDeletedEvent
  | ManufacturerRestoredEvent;

@Injectable()
@EventsHandler(
  ManufacturerCreatedEvent,
  ManufacturerUpdatedEvent,
  ManufacturerDeletedEvent,
  ManufacturerRestoredEvent,
)
export class ManufacturerProjector implements IEventHandler<ManufacturerEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ManufacturerEvent) {
    if (event instanceof ManufacturerCreatedEvent) {
      await this.onManufacturerCreated(event);
    } else if (event instanceof ManufacturerUpdatedEvent) {
      await this.onManufacturerUpdated(event);
    } else if (event instanceof ManufacturerDeletedEvent) {
      await this.onManufacturerDeleted(event);
    } else if (event instanceof ManufacturerRestoredEvent) {
      await this.onManufacturerRestored(event);
    }
  }

  private async onManufacturerCreated(
    event: ManufacturerCreatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.MANUFACTURER_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.manufacturer.create({
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

  private async onManufacturerUpdated(
    event: ManufacturerUpdatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.MANUFACTURER_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.ManufacturerUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }

      await this.prisma.manufacturer.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onManufacturerDeleted(
    event: ManufacturerDeletedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.MANUFACTURER_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.manufacturer.update({
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

  private async onManufacturerRestored(
    event: ManufacturerRestoredEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.MANUFACTURER_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.manufacturer.update({
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
