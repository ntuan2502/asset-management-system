import { IEvent } from '@nestjs/cqrs';

interface UserDeletedPayload {
  id: string;
}

export class UserDeletedEvent implements IEvent {
  public readonly id: string;

  constructor(payload: UserDeletedPayload) {
    Object.assign(this, payload);
  }
}
