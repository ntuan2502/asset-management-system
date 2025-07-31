import { IEvent } from '@nestjs/cqrs';

// Định nghĩa cấu trúc của một sự kiện sẽ được lưu trữ
export interface StoredEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: any;
  version: number;
}

// Token để inject vào các service khác
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
