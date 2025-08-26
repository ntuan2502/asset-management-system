import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { createId } from '@paralleldrive/cuid2';
import {
  ProductCreatedEvent,
  ProductCreatedPayload,
} from '../events/product-created.event';
import {
  ProductUpdatedEvent,
  ProductUpdatedPayload,
} from '../events/product-updated.event';
import { ProductDeletedEvent } from '../events/product-deleted.event';
import { ProductRestoredEvent } from '../events/product-restored.event';
import { UpdateProductInput } from 'src/1_application/product/dtos/update-product.input';
import { PRODUCT_ERRORS } from 'src/shared/constants/error-messages.constants';
import { ProductCategoryChangedEvent } from '../events/product-category-changed.event';
import { ProductManufacturerChangedEvent } from '../events/product-manufacturer-changed.event';

export class ProductAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.PRODUCT;

  public name: string;
  public modelNumber?: string | null;
  public categoryId: string;
  public manufacturerId: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createProduct(data: Omit<ProductCreatedPayload, 'id' | 'createdAt'>) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new ProductCreatedEvent({ id, ...data, createdAt }));
  }

  public updateProduct(payload: UpdateProductInput) {
    if (this.deletedAt) {
      throw new Error(PRODUCT_ERRORS.CANNOT_UPDATE_DELETED);
    }

    const changes: Partial<ProductUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }
    if (
      payload.modelNumber !== undefined &&
      payload.modelNumber !== this.modelNumber
    ) {
      changes.modelNumber = payload.modelNumber;
      hasChanges = true;
    }
    if (
      payload.categoryId !== undefined &&
      payload.categoryId !== this.categoryId
    ) {
      this.changeCategory(payload.categoryId);
    }
    if (
      payload.manufacturerId !== undefined &&
      payload.manufacturerId !== this.manufacturerId
    ) {
      this.changeManufacturer(payload.manufacturerId);
    }

    if (!hasChanges) {
      return;
    }

    const eventPayload: ProductUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new ProductUpdatedEvent(eventPayload));
  }

  public deleteProduct() {
    if (this.deletedAt) throw new Error(PRODUCT_ERRORS.ALREADY_DELETED);
    this.apply(new ProductDeletedEvent({ id: this.id, deletedAt: new Date() }));
  }

  public restoreProduct() {
    if (!this.deletedAt) throw new Error(PRODUCT_ERRORS.IS_ACTIVE);
    this.apply(
      new ProductRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  public changeCategory(newCategoryId: string) {
    if (this.categoryId === newCategoryId) return;

    this.apply(
      new ProductCategoryChangedEvent({
        id: this.id,
        newCategoryId,
        changedAt: new Date(),
      }),
    );
  }

  public changeManufacturer(newManufacturerId: string) {
    if (this.manufacturerId === newManufacturerId) return;

    this.apply(
      new ProductManufacturerChangedEvent({
        id: this.id,
        newManufacturerId,
        changedAt: new Date(),
      }),
    );
  }

  protected onProductCreatedEvent(event: ProductCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.modelNumber = event.modelNumber;
    this.categoryId = event.categoryId;
    this.manufacturerId = event.manufacturerId;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onProductUpdatedEvent(event: ProductUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    if (event.modelNumber !== undefined) {
      this.modelNumber = event.modelNumber;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }

  protected onProductDeletedEvent(event: ProductDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }

  protected onProductRestoredEvent(event: ProductRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }

  protected onProductCategoryChangedEvent(event: ProductCategoryChangedEvent) {
    this.categoryId = event.newCategoryId;
    this.updatedAt = event.changedAt;
    this.version++;
  }

  protected onProductManufacturerChangedEvent(
    event: ProductManufacturerChangedEvent,
  ) {
    this.manufacturerId = event.newManufacturerId;
    this.updatedAt = event.changedAt;
    this.version++;
  }
}
