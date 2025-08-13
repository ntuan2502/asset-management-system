import { IEvent } from '@nestjs/cqrs';

export interface UserCreatedPayload {
  id: string;
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  dob?: Date | null;
  gender?: string | null;
  officeId?: string | null;
  departmentId?: string | null;
  createdAt: Date;
}

export class UserCreatedEvent implements IEvent {
  public readonly id: string;
  public readonly email: string;
  public readonly hashedPassword: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly dob?: Date | null;
  public readonly gender?: string | null;
  public readonly officeId?: string | null;
  public readonly departmentId?: string | null;
  public readonly createdAt: Date;

  constructor(payload: UserCreatedPayload) {
    Object.assign(this, payload);
    if (this.dob) {
      this.dob = new Date(this.dob);
    }
    if (this.createdAt) {
      this.createdAt = new Date(this.createdAt);
    }
  }
}
