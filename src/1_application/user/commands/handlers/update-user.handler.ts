import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from '../impl/update-user.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly aggregateRepository: UserAggregateRepository,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserAggregate> {
    const { id, payload } = command;

    const user = await this.aggregateRepository.findById(id);
    if (!user.id) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

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
