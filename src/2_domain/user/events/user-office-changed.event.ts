import { IEvent } from '@nestjs/cqrs';

export interface UserOfficeChangedPayload {
  id: string; // userId
  newOfficeId: string | null;
  changedAt: Date;
}

export class UserOfficeChangedEvent implements IEvent {
  public readonly id: string;
  public readonly newOfficeId: string | null;
  public readonly changedAt: Date;

  constructor(payload: UserOfficeChangedPayload) {
    Object.assign(this, payload);
    if (this.changedAt) {
      this.changedAt = new Date(this.changedAt);
    }
  }
}
