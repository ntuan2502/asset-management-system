import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreManufacturerCommand } from '../impl/restore-manufacturer.command';
import { ManufacturerAggregateRepository } from 'src/2_domain/manufacturer/repositories/manufacturer-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { MANUFACTURER_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(RestoreManufacturerCommand)
export class RestoreManufacturerHandler
  implements ICommandHandler<RestoreManufacturerCommand>
{
  constructor(
    private readonly aggregateRepository: ManufacturerAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreManufacturerCommand): Promise<void> {
    const { id } = command;
    const manufacturer = await this.aggregateRepository.findById(id);
    if (!manufacturer.id) {
      throw new NotFoundException(MANUFACTURER_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = manufacturer.version;
    manufacturer.restoreManufacturer();

    const events = manufacturer.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        manufacturer.id,
        manufacturer.aggregateType,
        events,
        expectedVersion,
      );
      manufacturer.commit();
    }
  }
}
