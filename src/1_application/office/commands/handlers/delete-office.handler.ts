import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteOfficeCommand } from '../impl/delete-office.command';
import { OfficeAggregateRepository } from 'src/2_domain/office/repositories/office-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { OFFICE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(DeleteOfficeCommand)
export class DeleteOfficeHandler
  implements ICommandHandler<DeleteOfficeCommand>
{
  constructor(
    private readonly aggregateRepository: OfficeAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteOfficeCommand): Promise<void> {
    const { id } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(OFFICE_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.deleteOffice();

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
