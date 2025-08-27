import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteStatusLabelCommand } from '../impl/delete-status-label.command';
import { StatusLabelAggregateRepository } from 'src/2_domain/status-label/repositories/status-label-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { STATUS_LABEL_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(DeleteStatusLabelCommand)
export class DeleteStatusLabelHandler
  implements ICommandHandler<DeleteStatusLabelCommand>
{
  constructor(
    private readonly aggregateRepository: StatusLabelAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteStatusLabelCommand): Promise<void> {
    const { id } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(STATUS_LABEL_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.deleteStatusLabel();

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
