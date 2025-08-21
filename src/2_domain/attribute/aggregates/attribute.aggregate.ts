import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { createId } from '@paralleldrive/cuid2';
import {
  AttributeCreatedEvent,
  AttributeCreatedPayload,
} from '../events/attribute-created.event';
import { ATTRIBUTE_ERRORS } from 'src/shared/constants/error-messages.constants';
import {
  AttributeUpdatedEvent,
  AttributeUpdatedPayload,
} from '../events/attribute-updated.event';
import { AttributeDeletedEvent } from '../events/attribute-deleted.event';
import { AttributeRestoredEvent } from '../events/attribute-restored.event';
import { UpdateAttributeInput } from 'src/1_application/attribute/dtos/update-attribute.input';
import { ValueTypeEnum } from '../enums/value-type.enum';

export class AttributeAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.ATTRIBUTE;

  public name: string;
  public unit: string | null = null;
  public valueType: ValueTypeEnum;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createAttribute(
    data: Omit<AttributeCreatedPayload, 'id' | 'createdAt'>,
  ) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new AttributeCreatedEvent({ id, ...data, createdAt }));
  }

  public updateAttribute(payload: UpdateAttributeInput) {
    if (this.deletedAt) throw new Error(ATTRIBUTE_ERRORS.CANNOT_UPDATE_DELETED);

    const changes: Partial<AttributeUpdatedPayload> = {};
    let hasChanges = false;
    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
      hasChanges = true;
    }
    if (payload.unit !== undefined && payload.unit !== this.unit) {
      changes.unit = payload.unit;
      hasChanges = true;
    }
    if (payload.valueType && payload.valueType !== this.valueType) {
      changes.valueType = payload.valueType;
      hasChanges = true;
    }

    if (!hasChanges) return;

    this.apply(
      new AttributeUpdatedEvent({
        ...changes,
        id: this.id,
        updatedAt: new Date(),
      }),
    );
  }

  public deleteAttribute() {
    if (this.deletedAt) throw new Error(ATTRIBUTE_ERRORS.ALREADY_DELETED);

    this.apply(
      new AttributeDeletedEvent({ id: this.id, deletedAt: new Date() }),
    );
  }

  public restoreAttribute() {
    if (!this.deletedAt) throw new Error(ATTRIBUTE_ERRORS.IS_ACTIVE);

    this.apply(
      new AttributeRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onAttributeCreatedEvent(event: AttributeCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.unit = event.unit ?? null;
    this.valueType = event.valueType as ValueTypeEnum;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onAttributeUpdatedEvent(event: AttributeUpdatedEvent) {
    if (event.name !== undefined) this.name = event.name;
    if (event.unit !== undefined) this.unit = event.unit;
    if (event.valueType !== undefined) this.valueType = event.valueType;
    this.updatedAt = event.updatedAt;
    this.version++;
  }
  protected onAttributeDeletedEvent(event: AttributeDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }
  protected onAttributeRestoredEvent(event: AttributeRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
