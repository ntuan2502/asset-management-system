import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreOfficeCommand } from '../impl/restore-office.command';
import { OfficeAggregateRepository } from 'src/2_domain/office/repositories/office-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';

@CommandHandler(RestoreOfficeCommand)
export class RestoreOfficeHandler
  implements ICommandHandler<RestoreOfficeCommand>
{
  constructor(
    private readonly aggregateRepository: OfficeAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreOfficeCommand): Promise<void> {
    const { id } = command;
    const office = await this.aggregateRepository.findById(id);
    if (!office.id) {
      throw new NotFoundException(`Office with ID "${id}" not found.`);
    }

    const expectedVersion = office.version;
    office.restoreOffice();

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
