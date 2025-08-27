import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateProductCommand } from '../impl/create-product.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';
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

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: IManufacturerRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductAggregate> {
    const { input } = command;

    const existingProduct = await this.productRepository.findByName(input.name);
    if (existingProduct) {
      throw new Error(PRODUCT_ERRORS.ALREADY_EXISTS(input.name));
    }

    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new NotFoundException(CATEGORY_ERRORS.NOT_FOUND(input.categoryId));
    }

    const manufacturer = await this.manufacturerRepository.findById(
      input.manufacturerId,
    );
    if (!manufacturer) {
      throw new NotFoundException(
        MANUFACTURER_ERRORS.NOT_FOUND(input.manufacturerId),
      );
    }

    const data = this.publisher.mergeObjectContext(new ProductAggregate());
    data.createProduct(input);

    const events = data.getUncommittedEvents();
    await this.eventStore.saveEvents(data.id, data.aggregateType, events, 0);

    data.commit();
    return data;
  }
}
