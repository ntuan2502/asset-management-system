export const SNAPSHOT_STRATEGY = 'SNAPSHOT_STRATEGY';

export interface ISnapshotStrategy {
  shouldTakeSnapshot(aggregateVersion: number): boolean;
}
