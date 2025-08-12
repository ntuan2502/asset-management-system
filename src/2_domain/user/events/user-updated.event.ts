import { IEvent } from '@nestjs/cqrs';

export interface UserUpdatedPayload {
  id: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string | null;
  updatedAt: Date;
}

export class UserUpdatedEvent implements IEvent {
  public readonly id: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly dob?: Date;
  public readonly gender?: string | null;
  public readonly updatedAt: Date;

  constructor(payload: UserUpdatedPayload) {
    Object.assign(this, payload);

    if (this.dob) {
      this.dob = new Date(this.dob);
    }
    if (this.updatedAt) {
      this.updatedAt = new Date(this.updatedAt);
    }
  }
}
