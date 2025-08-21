import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateAttributeCommand } from '../impl/update-attribute.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import { AttributeAggregateRepository } from 'src/2_domain/attribute/repositories/attribute-aggregate.repository';
import { ATTRIBUTE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateAttributeCommand)
export class UpdateAttributeHandler
  implements ICommandHandler<UpdateAttributeCommand>
{
  constructor(
    private readonly aggregateRepository: AttributeAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateAttributeCommand): Promise<AttributeAggregate> {
    const { id, payload } = command;
    const attribute = await this.aggregateRepository.findById(id);
    if (!attribute.id) {
      throw new NotFoundException(ATTRIBUTE_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = attribute.version;
    attribute.updateAttribute(payload);

    const events = attribute.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        attribute.id,
        attribute.aggregateType,
        events,
        expectedVersion,
      );
      attribute.commit();
    }
    return attribute;
  }
}
