import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { createId } from '@paralleldrive/cuid2';
import {
  ManufacturerCreatedEvent,
  ManufacturerCreatedPayload,
} from '../events/manufacturer-created.event';
import {
  ManufacturerUpdatedEvent,
  ManufacturerUpdatedPayload,
} from '../events/manufacturer-updated.event';
import { ManufacturerDeletedEvent } from '../events/manufacturer-deleted.event';
import { ManufacturerRestoredEvent } from '../events/manufacturer-restored.event';
import { UpdateManufacturerInput } from 'src/1_application/manufacturer/dtos/update-manufacturer.input';
import { CATEGORY_ERRORS } from 'src/shared/constants/error-messages.constants';

export class ManufacturerAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.CATEGORY;

  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createManufacturer(
    data: Omit<ManufacturerCreatedPayload, 'id' | 'createdAt'>,
  ) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new ManufacturerCreatedEvent({ id, ...data, createdAt }));
  }

  public updateManufacturer(payload: UpdateManufacturerInput) {
    if (this.deletedAt) {
      throw new Error(CATEGORY_ERRORS.CANNOT_UPDATE_DELETED);
    }

    const changes: Partial<ManufacturerUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    const eventPayload: ManufacturerUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new ManufacturerUpdatedEvent(eventPayload));
  }

  public deleteManufacturer() {
    if (this.deletedAt) throw new Error(CATEGORY_ERRORS.ALREADY_DELETED);
    this.apply(
      new ManufacturerDeletedEvent({ id: this.id, deletedAt: new Date() }),
    );
  }

  public restoreManufacturer() {
    if (!this.deletedAt) throw new Error(CATEGORY_ERRORS.IS_ACTIVE);
    this.apply(
      new ManufacturerRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onManufacturerCreatedEvent(event: ManufacturerCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onManufacturerUpdatedEvent(event: ManufacturerUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }
  protected onManufacturerDeletedEvent(event: ManufacturerDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }
  protected onManufacturerRestoredEvent(event: ManufacturerRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
