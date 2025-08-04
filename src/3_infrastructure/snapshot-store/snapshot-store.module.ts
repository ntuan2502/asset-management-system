import { Module } from '@nestjs/common';
import { SnapshotStoreService } from './snapshot-store.service';
import { SNAPSHOT_STORE_SERVICE } from './snapshot-store.interface';
import { SNAPSHOT_STRATEGY } from './snapshot.strategy.interface';
import { VersionFrequencyStrategy } from './version-frequency.strategy';

@Module({
  providers: [
    {
      provide: SNAPSHOT_STORE_SERVICE,
      useClass: SnapshotStoreService,
    },
    {
      provide: SNAPSHOT_STRATEGY,
      useClass: VersionFrequencyStrategy,
    },
  ],
  exports: [SNAPSHOT_STORE_SERVICE, SNAPSHOT_STRATEGY],
})
export class SnapshotStoreModule {}
