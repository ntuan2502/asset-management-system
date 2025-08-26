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
import { PRODUCT_ERRORS } from 'src/shared/constants/error-messages.constants';

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

    // --- Bắt đầu Validation ---

    // 1. Validation: Tên sản phẩm không được trùng lặp
    const existingProduct = await this.productRepository.findByName(input.name);
    if (existingProduct) {
      throw new Error(PRODUCT_ERRORS.ALREADY_EXISTS(input.name));
    }

    // 2. Validation: Category phải tồn tại
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category with ID "${input.categoryId}" not found.`,
      );
    }

    // 3. Validation: Manufacturer phải tồn tại
    const manufacturer = await this.manufacturerRepository.findById(
      input.manufacturerId,
    );
    if (!manufacturer) {
      throw new NotFoundException(
        `Manufacturer with ID "${input.manufacturerId}" not found.`,
      );
    }

    // --- Kết thúc Validation ---

    // Tạo aggregate và phát ra sự kiện
    const product = this.publisher.mergeObjectContext(new ProductAggregate());
    product.createProduct(input);

    // Lưu và publish sự kiện
    const events = product.getUncommittedEvents();
    await this.eventStore.saveEvents(
      product.id,
      product.aggregateType,
      events,
      0,
    );

    product.commit();
    return product;
  }
}
