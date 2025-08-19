import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { CategoryCreatedEvent } from 'src/2_domain/category/events/category-created.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';
import { CategoryUpdatedEvent } from 'src/2_domain/category/events/category-updated.event';
import { CategoryDeletedEvent } from 'src/2_domain/category/events/category-deleted.event';
import { CategoryRestoredEvent } from 'src/2_domain/category/events/category-restored.event';
import { Prisma } from '@prisma/client';

type CategoryEvent =
  | CategoryCreatedEvent
  | CategoryUpdatedEvent
  | CategoryDeletedEvent
  | CategoryRestoredEvent;

@Injectable()
@EventsHandler(
  CategoryCreatedEvent,
  CategoryUpdatedEvent,
  CategoryDeletedEvent,
  CategoryRestoredEvent,
)
export class CategoryProjector implements IEventHandler<CategoryEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: CategoryEvent) {
    if (event instanceof CategoryCreatedEvent) {
      await this.onCategoryCreated(event);
    } else if (event instanceof CategoryUpdatedEvent) {
      await this.onCategoryUpdated(event);
    } else if (event instanceof CategoryDeletedEvent) {
      await this.onCategoryDeleted(event);
    } else if (event instanceof CategoryRestoredEvent) {
      await this.onCategoryRestored(event);
    }
  }

  private async onCategoryCreated(event: CategoryCreatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.CATEGORY_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.category.create({
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

  private async onCategoryUpdated(event: CategoryUpdatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.CATEGORY_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.CategoryUpdateInput = {
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

  private async onCategoryDeleted(event: CategoryDeletedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.CATEGORY_DELETED;
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

  private async onCategoryRestored(
    event: CategoryRestoredEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.CATEGORY_RESTORED;
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
