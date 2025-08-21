import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteAttributeCommand } from '../impl/delete-attribute.command';
import { AttributeAggregateRepository } from 'src/2_domain/attribute/repositories/attribute-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { ATTRIBUTE_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(DeleteAttributeCommand)
export class DeleteAttributeHandler
  implements ICommandHandler<DeleteAttributeCommand>
{
  constructor(
    private readonly aggregateRepository: AttributeAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteAttributeCommand): Promise<void> {
    const { id } = command;
    const attribute = await this.aggregateRepository.findById(id);
    if (!attribute.id) {
      throw new NotFoundException(ATTRIBUTE_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = attribute.version;
    attribute.deleteAttribute();

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
  }
}
