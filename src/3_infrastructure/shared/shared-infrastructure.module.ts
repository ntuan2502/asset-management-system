import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../event-store/event-store.module';
import { SnapshotStoreModule } from '../snapshot-store/snapshot-store.module';

@Module({
  imports: [CqrsModule, EventStoreModule, SnapshotStoreModule],
  exports: [CqrsModule, EventStoreModule, SnapshotStoreModule],
})
export class SharedInfrastructureModule {}
