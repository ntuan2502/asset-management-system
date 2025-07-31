import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from '../impl/update-user.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { EventFactory } from 'src/shared/factories/event.factory';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserAggregate> {
    const { id, payload } = command;

    const history = await this.eventStore.getEventsForAggregate(id);
    if (history.length === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const typedHistory = EventFactory.fromHistory(history);

    const userAggregate = new UserAggregate();
    userAggregate.loadFromHistory(typedHistory);

    const user = this.publisher.mergeObjectContext(userAggregate);

    const expectedVersion = user.version;

    user.updateInfo(payload);

    const events = user.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(id, 'User', events, expectedVersion);
      user.commit();
    }

    return user;
  }
}
