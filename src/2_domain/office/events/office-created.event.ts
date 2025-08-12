import { IEvent } from '@nestjs/cqrs';

export interface OfficeCreatedPayload {
  id: string;
  name: string;
  internationalName: string;
  shortName: string;
  taxCode: string;
  address: string;
  description?: string | null;
  createdAt: Date;
}

export class OfficeCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly internationalName: string;
  public readonly shortName: string;
  public readonly taxCode: string;
  public readonly address: string;
  public readonly description?: string | null;
  public readonly createdAt: Date;

  constructor(payload: OfficeCreatedPayload) {
    Object.assign(this, payload);

    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
