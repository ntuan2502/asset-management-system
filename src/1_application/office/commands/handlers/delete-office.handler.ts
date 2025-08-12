import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteOfficeCommand } from '../impl/delete-office.command';
import { OfficeAggregateRepository } from 'src/2_domain/office/repositories/office-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';

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
    const office = await this.aggregateRepository.findById(id);
    if (!office.id) {
      throw new NotFoundException(`Office with ID "${id}" not found.`);
    }

    const expectedVersion = office.version;
    office.deleteOffice();

    const events = office.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        office.id,
        office.aggregateType,
        events,
        expectedVersion,
      );
      office.commit();
    }
  }
}
