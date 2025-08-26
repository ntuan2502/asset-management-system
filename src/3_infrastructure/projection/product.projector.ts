import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ProductCreatedEvent } from 'src/2_domain/product/events/product-created.event';
import { ProductUpdatedEvent } from 'src/2_domain/product/events/product-updated.event';
import { Prisma } from '@prisma/client';
import { ProductDeletedEvent } from 'src/2_domain/product/events/product-deleted.event';
import { ProductRestoredEvent } from 'src/2_domain/product/events/product-restored.event';
import { PROJECTOR_LOGS } from 'src/shared/constants/log-messages.constants';
import { ProductCategoryChangedEvent } from 'src/2_domain/product/events/product-category-changed.event';
import { ProductManufacturerChangedEvent } from 'src/2_domain/product/events/product-manufacturer-changed.event';

type ProductEvent =
  | ProductCreatedEvent
  | ProductUpdatedEvent
  | ProductDeletedEvent
  | ProductRestoredEvent
  | ProductCategoryChangedEvent
  | ProductManufacturerChangedEvent;
@Injectable()
@EventsHandler(
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductDeletedEvent,
  ProductRestoredEvent,
  ProductCategoryChangedEvent,
  ProductManufacturerChangedEvent,
)
export class ProductProjector implements IEventHandler<ProductEvent> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(event: ProductEvent) {
    if (event instanceof ProductCreatedEvent) {
      await this.onProductCreated(event);
    } else if (event instanceof ProductUpdatedEvent) {
      await this.onProductUpdated(event);
    } else if (event instanceof ProductDeletedEvent) {
      await this.onProductDeleted(event);
    } else if (event instanceof ProductRestoredEvent) {
      await this.onProductRestored(event);
    } else if (event instanceof ProductCategoryChangedEvent) {
      await this.onProductCategoryChanged(event);
    } else if (event instanceof ProductManufacturerChangedEvent) {
      await this.onProductManufacturerChanged(event);
    }
  }
  private async onProductCreated(event: ProductCreatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_CREATED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.product.create({
        data: {
          id: event.id,
          name: event.name,
          modelNumber: event.modelNumber,
          categoryId: event.categoryId,
          manufacturerId: event.manufacturerId,
          createdAt: event.createdAt,
          updatedAt: event.createdAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onProductUpdated(event: ProductUpdatedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_UPDATED;
    try {
      console.log(logs.RECEIVED, event);
      const dataToUpdate: Prisma.ProductUpdateInput = {
        updatedAt: event.updatedAt,
      };

      if (event.name !== undefined) {
        dataToUpdate.name = event.name;
      }
      if (event.modelNumber !== undefined) {
        dataToUpdate.modelNumber = event.modelNumber;
      }

      await this.prisma.product.update({
        where: { id: event.id },
        data: dataToUpdate,
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onProductDeleted(event: ProductDeletedEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_DELETED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.product.update({
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

  private async onProductRestored(event: ProductRestoredEvent): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_RESTORED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.product.update({
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

  private async onProductCategoryChanged(
    event: ProductCategoryChangedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_CATEGORY_CHANGED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.product.update({
        where: { id: event.id },
        data: {
          category: { connect: { id: event.newCategoryId } },
          updatedAt: event.changedAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }

  private async onProductManufacturerChanged(
    event: ProductManufacturerChangedEvent,
  ): Promise<void> {
    const logs = PROJECTOR_LOGS.PRODUCT_MANUFACTURER_CHANGED;
    try {
      console.log(logs.RECEIVED, event);
      await this.prisma.product.update({
        where: { id: event.id },
        data: {
          manufacturer: { connect: { id: event.newManufacturerId } },
          updatedAt: event.changedAt,
        },
      });
      console.log(logs.SUCCESS(event.id));
    } catch (error) {
      console.error(logs.ERROR(event.id), error);
    }
  }
}
