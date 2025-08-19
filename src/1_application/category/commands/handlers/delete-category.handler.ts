import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteCategoryCommand } from '../impl/delete-category.command';
import { CategoryAggregateRepository } from 'src/2_domain/category/repositories/category-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { CATEGORY_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(
    private readonly aggregateRepository: CategoryAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const { id } = command;
    const category = await this.aggregateRepository.findById(id);
    if (!category.id) {
      throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = category.version;
    category.deleteCategory();

    const events = category.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        category.id,
        category.aggregateType,
        events,
        expectedVersion,
      );
      category.commit();
    }
  }
}
