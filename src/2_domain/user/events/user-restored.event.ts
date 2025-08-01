import { IEvent } from '@nestjs/cqrs';

export interface UserRestoredPayload {
  id: string;
  restoredAt: Date;
}

export class UserRestoredEvent implements IEvent {
  public readonly id: string;
  public readonly restoredAt: Date;

  constructor(payload: UserRestoredPayload) {
    Object.assign(this, payload);

    if (this.restoredAt) {
      this.restoredAt = new Date(this.restoredAt);
    }
  }
}
