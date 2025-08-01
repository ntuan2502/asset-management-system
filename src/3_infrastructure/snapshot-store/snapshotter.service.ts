import { Injectable, Inject } from '@nestjs/common';
import { IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AggregateRepository } from 'src/2_domain/user/repositories/aggregate.repository';
import {
  ISnapshotStore,
  SNAPSHOT_STORE_SERVICE,
} from './snapshot-store.interface';
import {
  ISnapshotStrategy,
  SNAPSHOT_STRATEGY,
} from './snapshot.strategy.interface';
import { UserCreatedEvent } from 'src/2_domain/user/events/user-created.event';
import { UserUpdatedEvent } from 'src/2_domain/user/events/user-updated.event';
import { UserDeletedEvent } from 'src/2_domain/user/events/user-deleted.event';

// Định nghĩa một kiểu union cho tất cả các sự kiện của User
type UserEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

@Injectable()
export class SnapshotterService {
  constructor(
    private readonly aggregateRepository: AggregateRepository,
    @Inject(SNAPSHOT_STORE_SERVICE)
    private readonly snapshotStore: ISnapshotStore,
    @Inject(SNAPSHOT_STRATEGY)
    private readonly snapshotStrategy: ISnapshotStrategy,
  ) {}

  // Một Saga là một phương thức được đánh dấu với @Saga
  // Nó nhận vào một stream (Observable) của tất cả các sự kiện
  @Saga()
  takeSnapshot = (events$: Observable<IEvent>): Observable<void> => {
    return events$.pipe(
      // Lọc để chỉ lấy các sự kiện thuộc về User
      ofType(UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent),
      // Gom nhóm các sự kiện theo aggregateId trong một khoảng thời gian ngắn
      // (Tạm thời bỏ qua để đơn giản, sẽ xử lý từng sự kiện một)
      mergeMap(async (event: UserEvent) => {
        // Tải aggregate để có được phiên bản mới nhất
        const aggregate = await this.aggregateRepository.loadUserAggregate(
          event.id,
        );

        // Kiểm tra xem có nên tạo snapshot không
        if (this.snapshotStrategy.shouldTakeSnapshot(aggregate.version)) {
          console.log(
            `Taking snapshot for User ${aggregate.id} at version ${aggregate.version}`,
          );
          await this.snapshotStore.saveSnapshot(aggregate);
        }
      }),
    );
  };
}
