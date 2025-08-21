import { IEvent } from '@nestjs/cqrs';
import { ValueTypeEnum } from '../enums/value-type.enum';

export interface AttributeUpdatedPayload {
  id: string;
  name?: string;
  unit?: string | null;
  valueType?: ValueTypeEnum;
  updatedAt: Date;
}

export class AttributeUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly unit?: string | null;
  public readonly valueType: ValueTypeEnum;
  public readonly updatedAt: Date;

  constructor(payload: AttributeUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
