export const SNAPSHOT_STRATEGY = 'SNAPSHOT_STRATEGY';

export interface ISnapshotStrategy {
  // Trả về true nếu cần tạo snapshot, ngược lại trả về false
  shouldTakeSnapshot(aggregateVersion: number): boolean;
}
