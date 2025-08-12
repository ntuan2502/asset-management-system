import { Injectable } from '@nestjs/common';
import { ISnapshotStrategy } from './snapshot.strategy.interface';

const SNAPSHOT_FREQUENCY = 3;

@Injectable()
export class VersionFrequencyStrategy implements ISnapshotStrategy {
  shouldTakeSnapshot(aggregateVersion: number): boolean {
    return aggregateVersion % SNAPSHOT_FREQUENCY === 0;
  }
}
