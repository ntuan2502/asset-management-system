import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreUserCommand } from '../impl/restore-user.command';
import { AggregateRepository } from 'src/2_domain/user/repositories/aggregate.repository';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';

@CommandHandler(RestoreUserCommand)
export class RestoreUserHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(
    private readonly aggregateRepository: AggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    const { id } = command;

    // Load aggregate (bao gồm cả các user đã bị xóa)
    const user = await this.aggregateRepository.loadUserAggregate(id);
    if (!user.id) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const expectedVersion = user.version;
    user.restore(); // Gọi phương thức nghiệp vụ

    const events = user.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(id, 'User', events, expectedVersion);
      user.commit();
    }
  }
}
