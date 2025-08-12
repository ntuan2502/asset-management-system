import { Injectable, Inject } from '@nestjs/common';
import { IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';

type UserEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

@Injectable()
export class SnapshotterService {
  constructor(
    private readonly aggregateRepository: UserAggregateRepository,
    @Inject(SNAPSHOT_STORE_SERVICE)
    private readonly snapshotStore: ISnapshotStore,
    @Inject(SNAPSHOT_STRATEGY)
    private readonly snapshotStrategy: ISnapshotStrategy,
  ) {}

  @Saga()
  takeSnapshot = (events$: Observable<IEvent>): Observable<void> => {
    return events$.pipe(
      ofType(UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent),
      mergeMap(async (event: UserEvent) => {
        const aggregate = await this.aggregateRepository.findById(event.id);

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
