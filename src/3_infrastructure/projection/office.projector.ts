import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { OfficeCreatedEvent } from 'src/2_domain/office/events/office-created.event';
import { OfficeUpdatedEvent } from 'src/2_domain/office/events/office-updated.event';
import { Prisma } from '@prisma/client';
import { OfficeDeletedEvent } from 'src/2_domain/office/events/office-deleted.event';
import { OfficeRestoredEvent } from 'src/2_domain/office/events/office-restored.event';

type OfficeEvent =
  | OfficeCreatedEvent
  | OfficeUpdatedEvent
  | OfficeDeletedEvent
  | OfficeRestoredEvent;
@Injectable()
@EventsHandler(
  OfficeCreatedEvent,
  OfficeUpdatedEvent,
  OfficeDeletedEvent,
  OfficeRestoredEvent,
)
export class OfficeProjector implements IEventHandler<OfficeEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: OfficeEvent) {
    if (event instanceof OfficeCreatedEvent) {
      await this.onOfficeCreated(event);
    } else if (event instanceof OfficeUpdatedEvent) {
      await this.onOfficeUpdated(event);
    } else if (event instanceof OfficeDeletedEvent) {
      await this.onOfficeDeleted(event);
    } else if (event instanceof OfficeRestoredEvent) {
      await this.onOfficeRestored(event);
    }
  }

  private async onOfficeCreated(event: OfficeCreatedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received OfficeCreatedEvent ---', event);
      await this.prisma.office.create({
        data: {
          id: event.id,
          name: event.name,
          internationalName: event.internationalName,
          shortName: event.shortName,
          taxCode: event.taxCode,
          address: event.address,
          description: event.description,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully created office ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR creating office ${event.id}:`,
        error,
      );
    }
  }

  private async onOfficeUpdated(event: OfficeUpdatedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received OfficeUpdatedEvent ---', event);
      const dataToUpdate: Prisma.OfficeUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }
      if (event.internationalName !== undefined) {
        dataToUpdate.internationalName = event.internationalName;
      }
      if (event.shortName !== undefined) {
        dataToUpdate.shortName = event.shortName;
      }
      if (event.taxCode !== undefined) {
        dataToUpdate.taxCode = event.taxCode;
      }
      if (event.address !== undefined) {
        dataToUpdate.address = event.address;
      }
      if (event.description !== undefined) {
        dataToUpdate.description = event.description;
      }

      await this.prisma.office.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(
        `--- [PROJECTOR] Successfully updated office ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR updating office ${event.id}:`,
        error,
      );
    }
  }

  private async onOfficeDeleted(event: OfficeDeletedEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received OfficeDeletedEvent ---', event);
      await this.prisma.office.update({
        where: { id: event.id },
        data: {
          deletedAt: event.deletedAt,
          updatedAt: event.deletedAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully soft-deleted office ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR soft-deleting office ${event.id}:`,
        error,
      );
    }
  }

  private async onOfficeRestored(event: OfficeRestoredEvent): Promise<void> {
    try {
      console.log('--- [PROJECTOR] Received OfficeRestoredEvent ---', event);
      await this.prisma.office.update({
        where: { id: event.id },
        data: {
          deletedAt: null,
          updatedAt: event.restoredAt,
        },
      });
      console.log(
        `--- [PROJECTOR] Successfully restored office ${event.id} ---`,
      );
    } catch (error) {
      console.error(
        `--- [PROJECTOR] ERROR restoring office ${event.id}:`,
        error,
      );
    }
  }
}
