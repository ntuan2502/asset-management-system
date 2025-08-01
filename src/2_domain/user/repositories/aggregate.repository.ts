import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import {
  ISnapshotStore,
  SNAPSHOT_STORE_SERVICE,
} from 'src/3_infrastructure/snapshot-store/snapshot-store.interface';
import { EventFactory } from 'src/shared/factories/event.factory';
import { UserAggregate } from '../aggregates/user.aggregate';

@Injectable()
export class AggregateRepository {
  constructor(
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(SNAPSHOT_STORE_SERVICE)
    private readonly snapshotStore: ISnapshotStore,
    private readonly publisher: EventPublisher,
  ) {}

  async loadUserAggregate(id: string): Promise<UserAggregate> {
    const aggregate = this.publisher.mergeObjectContext(new UserAggregate());

    let version = 0;

    // 1. Tải snapshot nếu có
    const snapshot = await this.snapshotStore.getLatestSnapshot(id);
    if (snapshot) {
      // Ép aggregate về trạng thái của snapshot
      Object.assign(aggregate, snapshot.payload);
      version = snapshot.version;
    }

    // 2. Tải các sự kiện SAU snapshot đó
    const history = await this.eventStore.getEventsForAggregate(id);
    const eventsAfterSnapshot = history
      .filter((event) => event.version > version)
      .map((event) => EventFactory.create(event));

    // 3. Tái tạo lại trạng thái từ các sự kiện còn lại
    aggregate.loadFromHistory(eventsAfterSnapshot);

    // 4. Gán version cuối cùng cho AggregateRoot
    // Version = version của snapshot + số lượng sự kiện sau đó
    aggregate.version = version + eventsAfterSnapshot.length;

    return aggregate;
  }
}
