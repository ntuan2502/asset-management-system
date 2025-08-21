import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { AttributeCreatedEvent } from 'src/2_domain/attribute/events/attribute-created.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';
import { AttributeUpdatedEvent } from 'src/2_domain/attribute/events/attribute-updated.event';
import { AttributeDeletedEvent } from 'src/2_domain/attribute/events/attribute-deleted.event';
import { AttributeRestoredEvent } from 'src/2_domain/attribute/events/attribute-restored.event';
import { Prisma } from '@prisma/client';

type AttributeEvent =
  | AttributeCreatedEvent
  | AttributeUpdatedEvent
  | AttributeDeletedEvent
  | AttributeRestoredEvent;
@Injectable()
@EventsHandler(
  AttributeCreatedEvent,
  AttributeUpdatedEvent,
  AttributeDeletedEvent,
  AttributeRestoredEvent,
)
export class AttributeProjector implements IEventHandler<AttributeEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: AttributeEvent) {
    if (event instanceof AttributeCreatedEvent) {
      await this.onAttributeCreated(event);
    } else if (event instanceof AttributeUpdatedEvent) {
      await this.onAttributeUpdated(event);
    } else if (event instanceof AttributeDeletedEvent) {
      await this.onAttributeDeleted(event);
    } else if (event instanceof AttributeRestoredEvent) {
      await this.onAttributeRestored(event);
    }
  }

  private async onAttributeCreated(
    event: AttributeCreatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.ATTRIBUTE_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.attribute.create({
        data: {
          id: event.id,
          name: event.name,
          unit: event.unit,
          valueType: event.valueType,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onAttributeUpdated(
    event: AttributeUpdatedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.ATTRIBUTE_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.AttributeUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }
      if (event.unit !== undefined) {
        dataToUpdate.unit = event.unit;
      }
      if (event.valueType !== undefined) {
        dataToUpdate.valueType = event.valueType;
      }

      await this.prisma.attribute.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onAttributeDeleted(
    event: AttributeDeletedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.ATTRIBUTE_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.attribute.update({
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

  private async onAttributeRestored(
    event: AttributeRestoredEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.ATTRIBUTE_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.attribute.update({
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
