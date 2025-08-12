import { Inject, Injectable } from '@nestjs/common';
import { BaseAggregateRepository } from 'src/3_infrastructure/shared/base-aggregate.repository';
import { RoleAggregate } from '../aggregates/role.aggregate';
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
export class RoleAggregateRepository extends BaseAggregateRepository<RoleAggregate> {
  constructor(
    @Inject(EVENT_STORE_SERVICE) eventStore: IEventStore,
    @Inject(SNAPSHOT_STORE_SERVICE) snapshotStore: ISnapshotStore,
    publisher: EventPublisher,
  ) {
    super(eventStore, snapshotStore, publisher);
  }
  async findById(id: string): Promise<RoleAggregate> {
    return this.loadAggregate(id, RoleAggregate);
  }
}
