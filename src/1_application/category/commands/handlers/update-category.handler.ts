import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from 'src/2_domain/category/repositories/category.repository.interface';
import { UpdateCategoryCommand } from 'src/1_application/category/commands/impl/update-category.command';
import { CategoryAggregateRepository } from 'src/2_domain/category/repositories/category-aggregate.repository';
import { DEPARTMENT_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    private readonly aggregateRepository: CategoryAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryAggregate> {
    const { id, payload } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(DEPARTMENT_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.updateCategory(payload);

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
    return data;
  }
}
