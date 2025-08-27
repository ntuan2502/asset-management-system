import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreUserCommand } from '../impl/restore-user.command';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';
import { USER_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(RestoreUserCommand)
export class RestoreUserHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(
    private readonly aggregateRepository: UserAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    const { id } = command;

    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.restoreUser();

    const events = data.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        data.id,
        data.aggregateType,
        events,
        expectedVersion,
      );
      data.commit();
    }
  }
}
