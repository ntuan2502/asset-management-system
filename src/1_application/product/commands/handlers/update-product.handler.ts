import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProductCommand } from '../impl/update-product.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';
import { ProductAggregateRepository } from 'src/2_domain/product/repositories/product-aggregate.repository';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from 'src/2_domain/product/repositories/product.repository.interface';
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from 'src/2_domain/category/repositories/category.repository.interface';
import {
  IManufacturerRepository,
  MANUFACTURER_REPOSITORY,
} from 'src/2_domain/manufacturer/repositories/manufacturer.repository.interface';
import {
  CATEGORY_ERRORS,
  MANUFACTURER_ERRORS,
  PRODUCT_ERRORS,
} from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly aggregateRepository: ProductAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductAggregate> {
    const { id, payload } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(PRODUCT_ERRORS.NOT_FOUND(id));
    }

    if (payload.name && payload.name !== data.name) {
      const existingProduct = await this.productRepository.findByName(
        payload.name,
      );
      if (existingProduct && existingProduct.id !== id) {
        throw new Error(PRODUCT_ERRORS.ALREADY_EXISTS(payload.name));
      }
    }

    if (payload.categoryId && payload.categoryId !== data.categoryId) {
      const category = await this.categoryRepository.findById(
        payload.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          CATEGORY_ERRORS.NOT_FOUND(payload.categoryId),
        );
      }
    }

    if (
      payload.manufacturerId &&
      payload.manufacturerId !== data.manufacturerId
    ) {
      const manufacturer = await this.manufacturerRepository.findById(
        payload.manufacturerId,
      );
      if (!manufacturer) {
        throw new NotFoundException(
          MANUFACTURER_ERRORS.NOT_FOUND(payload.manufacturerId),
        );
      }
    }

    const expectedVersion = data.version;
    data.updateProduct(payload);

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

    return data;
  }
}
