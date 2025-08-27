import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteManufacturerCommand } from '../impl/delete-manufacturer.command';
import { ManufacturerAggregateRepository } from 'src/2_domain/manufacturer/repositories/manufacturer-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { MANUFACTURER_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(DeleteManufacturerCommand)
export class DeleteManufacturerHandler
  implements ICommandHandler<DeleteManufacturerCommand>
{
  constructor(
    private readonly aggregateRepository: ManufacturerAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteManufacturerCommand): Promise<void> {
    const { id } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(MANUFACTURER_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = data.version;
    data.deleteManufacturer();

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
