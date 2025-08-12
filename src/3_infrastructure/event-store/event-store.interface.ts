import { IEvent } from '@nestjs/cqrs';

export interface StoredEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: any;
  version: number;
}

export const EVENT_STORE_SERVICE = 'EVENT_STORE_SERVICE';

export interface IEventStore {
  saveEvents(
    aggregateId: string,
    aggregateType: string,
    events: IEvent[],
    expectedVersion: number,
  ): Promise<void>;

  getEventsForAggregate(aggregateId: string): Promise<StoredEvent[]>;
}
