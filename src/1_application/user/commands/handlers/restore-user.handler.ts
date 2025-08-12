import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreUserCommand } from '../impl/restore-user.command';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';

@CommandHandler(RestoreUserCommand)
export class RestoreUserHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(
    private readonly aggregateRepository: UserAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    const { id } = command;

    const user = await this.aggregateRepository.findById(id);
    if (!user.id) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const expectedVersion = user.version;
    user.restoreUser();

    const events = user.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        user.id,
        user.aggregateType,
        events,
        expectedVersion,
      );
      user.commit();
    }
  }
}
