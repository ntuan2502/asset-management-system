import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { AGGREGATE_TYPES } from 'src/shared/constants/aggregate-types.constants';
import { createId } from '@paralleldrive/cuid2';
import {
  StatusLabelCreatedEvent,
  StatusLabelCreatedPayload,
} from '../events/status-label-created.event';
import {
  StatusLabelUpdatedEvent,
  StatusLabelUpdatedPayload,
} from '../events/status-label-updated.event';
import { StatusLabelDeletedEvent } from '../events/status-label-deleted.event';
import { StatusLabelRestoredEvent } from '../events/status-label-restored.event';
import { UpdateStatusLabelInput } from 'src/1_application/status-label/dtos/update-status-label.input';
import { STATUS_LABEL_ERRORS } from 'src/shared/constants/error-messages.constants';

export class StatusLabelAggregate extends BaseAggregateRoot {
  public readonly aggregateType = AGGREGATE_TYPES.STATUS_LABEL;

  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createStatusLabel(
    data: Omit<StatusLabelCreatedPayload, 'id' | 'createdAt'>,
  ) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new StatusLabelCreatedEvent({ id, ...data, createdAt }));
  }

  public updateStatusLabel(payload: UpdateStatusLabelInput) {
    if (this.deletedAt) {
      throw new Error(STATUS_LABEL_ERRORS.CANNOT_UPDATE_DELETED);
    }

    const changes: Partial<StatusLabelUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }

    const eventPayload: StatusLabelUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new StatusLabelUpdatedEvent(eventPayload));
  }

  public deleteStatusLabel() {
    if (this.deletedAt) throw new Error(STATUS_LABEL_ERRORS.ALREADY_DELETED);
    this.apply(
      new StatusLabelDeletedEvent({ id: this.id, deletedAt: new Date() }),
    );
  }

  public restoreStatusLabel() {
    if (!this.deletedAt) throw new Error(STATUS_LABEL_ERRORS.IS_ACTIVE);
    this.apply(
      new StatusLabelRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onStatusLabelCreatedEvent(event: StatusLabelCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onStatusLabelUpdatedEvent(event: StatusLabelUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }
  protected onStatusLabelDeletedEvent(event: StatusLabelDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }
  protected onStatusLabelRestoredEvent(event: StatusLabelRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
