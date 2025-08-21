import { IEvent } from '@nestjs/cqrs';
import { ValueTypeEnum } from '../enums/value-type.enum';

export interface AttributeCreatedPayload {
  id: string;
  name: string;
  unit?: string | null;
  valueType: ValueTypeEnum;
  createdAt: Date;
}

export class AttributeCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly unit?: string | null;
  public readonly valueType: string;
  public readonly createdAt: Date;

  constructor(payload: AttributeCreatedPayload) {
    Object.assign(this, payload);
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
