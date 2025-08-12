import { createId } from '@paralleldrive/cuid2';
import {
  OfficeCreatedEvent,
  OfficeCreatedPayload,
} from '../events/office-created.event';
import {
  OfficeUpdatedEvent,
  OfficeUpdatedPayload,
} from '../events/office-updated.event';
import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { OfficeDeletedEvent } from '../events/office-deleted.event';
import { OfficeRestoredEvent } from '../events/office-restored.event';
import { AGGREGATE_TYPES } from 'src/shared/constants/aggregate-types.constants';
import { UpdateOfficeInput } from 'src/1_application/office/dtos/update-office.input';

export class OfficeAggregate extends BaseAggregateRoot {
  public readonly aggregateType = AGGREGATE_TYPES.OFFICE;

  public name: string;
  public internationalName: string;
  public shortName: string;
  public taxCode: string;
  public address: string;
  public description: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createOffice(data: Omit<OfficeCreatedPayload, 'id' | 'createdAt'>) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new OfficeCreatedEvent({ id, ...data, createdAt }));
  }

  public updateOffice(payload: UpdateOfficeInput) {
    if (this.deletedAt) {
      throw new Error('Cannot update a deleted office.');
    }

    const changes: Partial<OfficeUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }
    if (
      payload.internationalName &&
      payload.internationalName !== this.internationalName
    ) {
      changes.internationalName = payload.internationalName;
      hasChanges = true;
    }
    if (payload.shortName && payload.shortName !== this.shortName) {
      changes.shortName = payload.shortName;
      hasChanges = true;
    }
    if (payload.taxCode && payload.taxCode !== this.taxCode) {
      changes.taxCode = payload.taxCode;
      hasChanges = true;
    }
    if (payload.address && payload.address !== this.address) {
      changes.address = payload.address;
      hasChanges = true;
    }
    if (
      payload.description !== undefined &&
      payload.description !== this.description
    ) {
      changes.description = payload.description;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    this.apply(
      new OfficeUpdatedEvent({
        ...changes,
        id: this.id,
        updatedAt: new Date(),
      }),
    );
  }

  public deleteOffice() {
    if (this.deletedAt) {
      throw new Error('Cannot delete an office that has already been deleted.');
    }
    this.apply(new OfficeDeletedEvent({ id: this.id, deletedAt: new Date() }));
  }

  public restoreOffice() {
    if (!this.deletedAt) {
      throw new Error('Cannot restore an active office.');
    }
    this.apply(
      new OfficeRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onOfficeCreatedEvent(event: OfficeCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.internationalName = event.internationalName;
    this.shortName = event.shortName;
    this.taxCode = event.taxCode;
    this.address = event.address;
    this.description = event.description ?? null;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onOfficeUpdatedEvent(event: OfficeUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    if (event.internationalName !== undefined) {
      this.internationalName = event.internationalName;
    }
    if (event.shortName !== undefined) {
      this.shortName = event.shortName;
    }
    if (event.taxCode !== undefined) {
      this.taxCode = event.taxCode;
    }
    if (event.address !== undefined) {
      this.address = event.address;
    }
    if (event.description !== undefined) {
      this.description = event.description;
    }

    this.updatedAt = event.updatedAt;
    this.version++;
  }

  protected onOfficeDeletedEvent(event: OfficeDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }

  protected onOfficeRestoredEvent(event: OfficeRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
