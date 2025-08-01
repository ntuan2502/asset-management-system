import { UserSnapshotDto } from 'src/2_domain/user/aggregates/user-snapshot.dto';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

export interface StoredSnapshot {
  version: number;
  payload: UserSnapshotDto;
}

export const SNAPSHOT_STORE_SERVICE = 'SNAPSHOT_STORE_SERVICE';

export interface ISnapshotStore {
  getLatestSnapshot(aggregateId: string): Promise<StoredSnapshot | null>;
  saveSnapshot(aggregate: UserAggregate): Promise<void>;
}
