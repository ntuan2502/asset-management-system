import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreProductCommand } from '../impl/restore-product.command';
import { ProductAggregateRepository } from 'src/2_domain/product/repositories/product-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { PRODUCT_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(RestoreProductCommand)
export class RestoreProductHandler
  implements ICommandHandler<RestoreProductCommand>
{
  constructor(
    private readonly aggregateRepository: ProductAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreProductCommand): Promise<void> {
    const { id } = command;
    // Tải aggregate, bao gồm cả các bản ghi đã bị soft-delete
    const product = await this.aggregateRepository.findById(id);
    if (!product.id) {
      throw new NotFoundException(PRODUCT_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = product.version;
    product.restoreProduct();

    const events = product.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        product.id,
        product.aggregateType,
        events,
        expectedVersion,
      );
      product.commit();
    }
  }
}
