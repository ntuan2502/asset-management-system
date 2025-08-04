import { Inject, Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { UserAggregate } from '../aggregates/user.aggregate';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';
import {
  ISnapshotStore,
  SNAPSHOT_STORE_SERVICE,
} from 'src/3_infrastructure/snapshot-store/snapshot-store.interface';
import { EventPublisher } from '@nestjs/cqrs';

@Injectable()
export class UserAggregateRepository extends BaseAggregateRepository<UserAggregate> {
  constructor(
    @Inject(EVENT_STORE_SERVICE) eventStore: IEventStore,
    @Inject(SNAPSHOT_STORE_SERVICE) snapshotStore: ISnapshotStore,
    publisher: EventPublisher,
  ) {
    super(eventStore, snapshotStore, publisher); // << Gọi super()
  }

  async findById(id: string): Promise<UserAggregate> {
    return this.loadAggregate(id, UserAggregate);
  }
}
