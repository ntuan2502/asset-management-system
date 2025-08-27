import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateCategoryCommand } from '../impl/create-category.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from 'src/2_domain/category/repositories/category.repository.interface';
import { CATEGORY_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<CategoryAggregate> {
    const { input } = command;

    const existingCategory = await this.categoryRepository.findByName(
      input.name,
    );
    if (existingCategory) {
      throw new Error(CATEGORY_ERRORS.ALREADY_EXISTS(input.name));
    }

    const data = this.publisher.mergeObjectContext(new CategoryAggregate());
    data.createCategory({ name: input.name });

    const events = data.getUncommittedEvents();
    await this.eventStore.saveEvents(data.id, data.aggregateType, events, 0);

    data.commit();
    return data;
  }
}
