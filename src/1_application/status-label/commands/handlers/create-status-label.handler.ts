import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateStatusLabelCommand } from '../impl/create-status-label.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
import {
  IStatusLabelRepository,
  STATUS_LABEL_REPOSITORY,
} from 'src/2_domain/status-label/repositories/status-label.repository.interface';
import { STATUS_LABEL_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateStatusLabelCommand)
export class CreateStatusLabelHandler
  implements ICommandHandler<CreateStatusLabelCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(STATUS_LABEL_REPOSITORY)
    private readonly statusLabelRepository: IStatusLabelRepository,
  ) {}

  async execute(
    command: CreateStatusLabelCommand,
  ): Promise<StatusLabelAggregate> {
    const { input } = command;

    const existingStatusLabel = await this.statusLabelRepository.findByName(
      input.name,
    );
    if (existingStatusLabel) {
      throw new Error(STATUS_LABEL_ERRORS.ALREADY_EXISTS(input.name));
    }

    const data = this.publisher.mergeObjectContext(new StatusLabelAggregate());
    data.createStatusLabel({ name: input.name });

    const events = data.getUncommittedEvents();
    await this.eventStore.saveEvents(data.id, data.aggregateType, events, 0);

    data.commit();
    return data;
  }
}
