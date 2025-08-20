import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { createId } from '@paralleldrive/cuid2';
import {
  CategoryCreatedEvent,
  CategoryCreatedPayload,
} from '../events/category-created.event';
import {
  CategoryUpdatedEvent,
  CategoryUpdatedPayload,
} from '../events/category-updated.event';
import { CategoryDeletedEvent } from '../events/category-deleted.event';
import { CategoryRestoredEvent } from '../events/category-restored.event';
import { UpdateCategoryInput } from 'src/1_application/category/dtos/update-category.input';
import { CATEGORY_ERRORS } from 'src/shared/constants/error-messages.constants';

export class CategoryAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.CATEGORY;

  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createCategory(
    data: Omit<CategoryCreatedPayload, 'id' | 'createdAt'>,
  ) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new CategoryCreatedEvent({ id, ...data, createdAt }));
  }

  public updateCategory(payload: UpdateCategoryInput) {
    if (this.deletedAt) {
      throw new Error(CATEGORY_ERRORS.CANNOT_UPDATE_DELETED);
    }

    const changes: Partial<CategoryUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    const eventPayload: CategoryUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new CategoryUpdatedEvent(eventPayload));
  }

  public deleteCategory() {
    if (this.deletedAt) throw new Error(CATEGORY_ERRORS.ALREADY_DELETED);
    this.apply(
      new CategoryDeletedEvent({ id: this.id, deletedAt: new Date() }),
    );
  }

  public restoreCategory() {
    if (!this.deletedAt) throw new Error(CATEGORY_ERRORS.IS_ACTIVE);
    this.apply(
      new CategoryRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onCategoryCreatedEvent(event: CategoryCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onCategoryUpdatedEvent(event: CategoryUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }
  protected onCategoryDeletedEvent(event: CategoryDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }
  protected onCategoryRestoredEvent(event: CategoryRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
