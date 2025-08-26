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
import { PRODUCT_ERRORS } from 'src/shared/constants/error-messages.constants';

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
    const product = await this.aggregateRepository.findById(id);
    if (!product.id) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    // --- Bắt đầu Validation ---

    // 1. Validation: Nếu tên sản phẩm thay đổi, kiểm tra xem tên mới có bị trùng không
    if (payload.name && payload.name !== product.name) {
      const existingProduct = await this.productRepository.findByName(
        payload.name,
      );
      if (existingProduct && existingProduct.id !== id) {
        throw new Error(PRODUCT_ERRORS.ALREADY_EXISTS(payload.name));
      }
    }

    // 2. Validation: Nếu categoryId thay đổi, kiểm tra xem nó có tồn tại không
    if (payload.categoryId && payload.categoryId !== product.categoryId) {
      const category = await this.categoryRepository.findById(
        payload.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID "${payload.categoryId}" not found.`,
        );
      }
    }

    // 3. Validation: Nếu manufacturerId thay đổi, kiểm tra xem nó có tồn tại không
    if (
      payload.manufacturerId &&
      payload.manufacturerId !== product.manufacturerId
    ) {
      const manufacturer = await this.manufacturerRepository.findById(
        payload.manufacturerId,
      );
      if (!manufacturer) {
        throw new NotFoundException(
          `Manufacturer with ID "${payload.manufacturerId}" not found.`,
        );
      }
    }

    // --- Kết thúc Validation ---

    // Thực thi logic nghiệp vụ
    const expectedVersion = product.version;
    product.updateProduct(payload);

    // Lưu và publish sự kiện
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

    return product;
  }
}
