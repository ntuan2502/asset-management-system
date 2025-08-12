import { IEvent } from '@nestjs/cqrs';

export interface OfficeUpdatedPayload {
  id: string;
  name?: string;
  internationalName?: string;
  shortName?: string;
  taxCode?: string;
  address?: string;
  description?: string | null;
  updatedAt: Date;
}

export class OfficeUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly name?: string;
  public readonly internationalName?: string;
  public readonly shortName?: string;
  public readonly taxCode?: string;
  public readonly address?: string;
  public readonly description?: string | null;
  public readonly updatedAt: Date;

  constructor(payload: OfficeUpdatedPayload) {
    Object.assign(this, payload);
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
