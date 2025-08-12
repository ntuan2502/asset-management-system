import { AggregateRoot, IEvent } from '@nestjs/cqrs';

export abstract class BaseAggregateRoot extends AggregateRoot {
  public id: string;
  public version = 0;

  public abstract readonly aggregateType: string;

  public loadFromHistory(history: IEvent[]) {
    history.forEach((event) => this.apply(event, true));
  }
}
