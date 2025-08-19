import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import {
  IManufacturerRepository,
  MANUFACTURER_REPOSITORY,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import { UpdateManufacturerCommand } from 'src/1_application/manufacturer/commands/impl/update-manufacturer.command';
import { ManufacturerAggregateRepository } from 'src/2_domain/manufacturer/repositories/manufacturer-aggregate.repository';
import { MANUFACTURER_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateManufacturerCommand)
export class UpdateManufacturerHandler
  implements ICommandHandler<UpdateManufacturerCommand>
{
  constructor(
    private readonly aggregateRepository: ManufacturerAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(
    command: UpdateManufacturerCommand,
  ): Promise<ManufacturerAggregate> {
    const { id, payload } = command;
    const manufacturer = await this.aggregateRepository.findById(id);
    if (!manufacturer.id) {
      throw new NotFoundException(MANUFACTURER_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = manufacturer.version;
    manufacturer.updateManufacturer(payload);

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
    return manufacturer;
  }
}
