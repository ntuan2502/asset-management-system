import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateOfficeCommand } from '../impl/update-office.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';
import { OfficeAggregateRepository } from 'src/2_domain/office/repositories/office-aggregate.repository';
import { OFFICE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateOfficeCommand)
export class UpdateOfficeHandler
  implements ICommandHandler<UpdateOfficeCommand>
{
  constructor(
    private readonly aggregateRepository: OfficeAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateOfficeCommand): Promise<OfficeAggregate> {
    const { id, payload } = command;
    const office = await this.aggregateRepository.findById(id);
    if (!office.id) {
      throw new NotFoundException(OFFICE_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = office.version;
    office.updateOffice(payload);

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
    return office;
  }
}
