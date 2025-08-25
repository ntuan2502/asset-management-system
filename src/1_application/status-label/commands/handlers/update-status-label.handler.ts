import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
import {
  IStatusLabelRepository,
  STATUS_LABEL_REPOSITORY,
} from 'src/2_domain/status-label/repositories/status-label.repository.interface';
import { UpdateStatusLabelCommand } from 'src/1_application/status-label/commands/impl/update-status-label.command';
import { StatusLabelAggregateRepository } from 'src/2_domain/status-label/repositories/status-label-aggregate.repository';
import { STATUS_LABEL_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateStatusLabelCommand)
export class UpdateStatusLabelHandler
  implements ICommandHandler<UpdateStatusLabelCommand>
{
  constructor(
    private readonly aggregateRepository: StatusLabelAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(STATUS_LABEL_REPOSITORY)
    private readonly statusLabelRepository: IStatusLabelRepository,
  ) {}

  async execute(
    command: UpdateStatusLabelCommand,
  ): Promise<StatusLabelAggregate> {
    const { id, payload } = command;
    const statusLabel = await this.aggregateRepository.findById(id);
    if (!statusLabel.id) {
      throw new NotFoundException(STATUS_LABEL_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = statusLabel.version;
    statusLabel.updateStatusLabel(payload);

    const events = statusLabel.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        statusLabel.id,
        statusLabel.aggregateType,
        events,
        expectedVersion,
      );
      statusLabel.commit();
    }
    return statusLabel;
  }
}
