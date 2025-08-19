import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateManufacturerCommand } from '../impl/create-manufacturer.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
import {
  IManufacturerRepository,
  MANUFACTURER_REPOSITORY,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import { MANUFACTURER_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateManufacturerCommand)
export class CreateManufacturerHandler
  implements ICommandHandler<CreateManufacturerCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(
    command: CreateManufacturerCommand,
  ): Promise<ManufacturerAggregate> {
    const { input } = command;

    const existingManufacturer = await this.manufacturerRepository.findByName(
      input.name,
    );
    if (existingManufacturer) {
      throw new Error(MANUFACTURER_ERRORS.ALREADY_EXISTS(input.name));
    }

    const manufacturer = this.publisher.mergeObjectContext(
      new ManufacturerAggregate(),
    );
    manufacturer.createManufacturer({ name: input.name });

    const events = manufacturer.getUncommittedEvents();
    await this.eventStore.saveEvents(
      manufacturer.id,
      manufacturer.aggregateType,
      events,
      0,
    );

    manufacturer.commit();
    return manufacturer;
  }
}
