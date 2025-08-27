import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOfficeCommand } from '../impl/create-office.command';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';
import { OFFICE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateOfficeCommand)
export class CreateOfficeHandler
  implements ICommandHandler<CreateOfficeCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepository: IOfficeRepository,
  ) {}

  async execute(command: CreateOfficeCommand): Promise<OfficeAggregate> {
    const { input } = command;

    const isDuplicate = await this.officeRepository.isDuplicate({
      internationalName: input.internationalName,
      shortName: input.shortName,
      taxCode: input.taxCode,
    });
    if (isDuplicate) {
      throw new Error(OFFICE_ERRORS.DUPLICATE);
    }

    const data = this.publisher.mergeObjectContext(new OfficeAggregate());
    data.createOffice(input);

    const events = data.getUncommittedEvents();
    await this.eventStore.saveEvents(data.id, data.aggregateType, events, 0);

    data.commit();
    return data;
  }
}
