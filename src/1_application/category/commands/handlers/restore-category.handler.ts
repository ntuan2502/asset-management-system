import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreCategoryCommand } from '../impl/restore-category.command';
import { CategoryAggregateRepository } from 'src/2_domain/category/repositories/category-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { CATEGORY_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(RestoreCategoryCommand)
export class RestoreCategoryHandler
  implements ICommandHandler<RestoreCategoryCommand>
{
  constructor(
    private readonly aggregateRepository: CategoryAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreCategoryCommand): Promise<void> {
    const { id } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.restoreCategory();

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
