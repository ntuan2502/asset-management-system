import { Inject } from '@nestjs/common';
import { EventPublisher, IEvent } from '@nestjs/cqrs';
import { AggregateRoot } from '@nestjs/cqrs/dist/aggregate-root';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from '../event-store/event-store.interface';
import {
  ISnapshotStore,
  SNAPSHOT_STORE_SERVICE,
} from '../snapshot-store/snapshot-store.interface';
import { EventFactory } from 'src/shared/factories/event.factory';

// Định nghĩa một kiểu cho constructor của aggregate
type AggregateConstructor<T extends AggregateRoot> = new (...args: any[]) => T;

export class BaseAggregateRepository<
  T extends AggregateRoot & {
    loadFromHistory(history: IEvent[]): void;
    version: number;
  },
> {
  constructor(
    @Inject(EVENT_STORE_SERVICE) protected readonly eventStore: IEventStore,
    @Inject(SNAPSHOT_STORE_SERVICE)
    protected readonly snapshotStore: ISnapshotStore,
    protected readonly publisher: EventPublisher,
  ) {}

  async loadAggregate(
    id: string,
    aggregateClass: AggregateConstructor<T>,
  ): Promise<T> {
    const aggregate = this.publisher.mergeObjectContext(new aggregateClass());

    let version = 0;

    const snapshot = await this.snapshotStore.getLatestSnapshot(id);
    if (snapshot) {
      // Cần một cách chung để tải snapshot
      Object.assign(aggregate, snapshot.payload);
      aggregate.version = snapshot.version;
      version = snapshot.version;
    }

    const history = await this.eventStore.getEventsForAggregate(id);
    const eventsAfterSnapshot = history
      .filter((event) => event.version > version)
      .map((event) => EventFactory.create(event));

    if (eventsAfterSnapshot.length > 0) {
      aggregate.loadFromHistory(eventsAfterSnapshot);
      aggregate.version = version + eventsAfterSnapshot.length;
    }

    return aggregate;
  }
}
