import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateAttributeCommand } from '../impl/create-attribute.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import {
  IAttributeRepository,
  ATTRIBUTE_REPOSITORY,
} from 'src/2_domain/attribute/repositories/attribute.repository.interface';
import { ATTRIBUTE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateAttributeCommand)
export class CreateAttributeHandler
  implements ICommandHandler<CreateAttributeCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(ATTRIBUTE_REPOSITORY)
    private readonly attributeRepository: IAttributeRepository,
  ) {}

  async execute(command: CreateAttributeCommand): Promise<AttributeAggregate> {
    const { input } = command;

    // Validation: Tên không được trùng
    const existingAttribute = await this.attributeRepository.findByName(
      input.name,
    );
    if (existingAttribute) {
      throw new Error(ATTRIBUTE_ERRORS.ALREADY_EXISTS(input.name));
    }

    const attribute = this.publisher.mergeObjectContext(
      new AttributeAggregate(),
    );
    attribute.createAttribute({
      name: input.name,
      unit: input.unit,
      valueType: input.valueType,
    });

    const events = attribute.getUncommittedEvents();
    await this.eventStore.saveEvents(
      attribute.id,
      attribute.aggregateType,
      events,
      0,
    );

    attribute.commit();
    return attribute;
  }
}
