import { BaseAggregateRoot } from 'src/shared/domain/base.aggregate';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { createId } from '@paralleldrive/cuid2';
import {
  DepartmentCreatedEvent,
  DepartmentCreatedPayload,
} from '../events/department-created.event';
import {
  DepartmentUpdatedEvent,
  DepartmentUpdatedPayload,
} from '../events/department-updated.event';
import { DepartmentDeletedEvent } from '../events/department-deleted.event';
import { DepartmentRestoredEvent } from '../events/department-restored.event';
import { UpdateDepartmentInput } from 'src/1_application/department/dtos/update-department.input';
import { DEPARTMENT_ERRORS } from 'src/shared/constants/error-messages.constants';

export class DepartmentAggregate extends BaseAggregateRoot {
  public readonly aggregateType = ENTITY_SUBJECTS.DEPARTMENT;

  public name: string;
  public officeId: string;
  public description: string | null = null;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date | null = null;

  public createDepartment(
    data: Omit<DepartmentCreatedPayload, 'id' | 'createdAt'>,
  ) {
    const id = createId();
    const createdAt = new Date();
    this.apply(new DepartmentCreatedEvent({ id, ...data, createdAt }));
  }

  public updateDepartment(payload: UpdateDepartmentInput) {
    if (this.deletedAt) {
      throw new Error(DEPARTMENT_ERRORS.CANNOT_UPDATE_DELETED);
    }

    const changes: Partial<DepartmentUpdatedPayload> = {};
    let hasChanges = false;

    if (payload.name && payload.name !== this.name) {
      changes.name = payload.name;
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

    const eventPayload: DepartmentUpdatedPayload = {
      ...changes,
      id: this.id,
      updatedAt: new Date(),
    };

    this.apply(new DepartmentUpdatedEvent(eventPayload));
  }

  public deleteDepartment() {
    if (this.deletedAt) throw new Error(DEPARTMENT_ERRORS.ALREADY_DELETED);
    this.apply(
      new DepartmentDeletedEvent({ id: this.id, deletedAt: new Date() }),
    );
  }

  public restoreDepartment() {
    if (!this.deletedAt) throw new Error(DEPARTMENT_ERRORS.IS_ACTIVE);
    this.apply(
      new DepartmentRestoredEvent({ id: this.id, restoredAt: new Date() }),
    );
  }

  protected onDepartmentCreatedEvent(event: DepartmentCreatedEvent) {
    this.id = event.id;
    this.name = event.name;
    this.officeId = event.officeId;
    this.description = event.description ?? null;
    this.createdAt = event.createdAt;
    this.updatedAt = event.createdAt;
    this.version = 1;
  }

  protected onDepartmentUpdatedEvent(event: DepartmentUpdatedEvent) {
    if (event.name !== undefined) {
      this.name = event.name;
    }
    if (event.description !== undefined) {
      this.description = event.description;
    }
    this.updatedAt = event.updatedAt;
    this.version++;
  }

  protected onDepartmentDeletedEvent(event: DepartmentDeletedEvent) {
    this.deletedAt = event.deletedAt;
    this.updatedAt = event.deletedAt;
    this.version++;
  }

  protected onDepartmentRestoredEvent(event: DepartmentRestoredEvent) {
    this.deletedAt = null;
    this.updatedAt = event.restoredAt;
    this.version++;
  }
}
