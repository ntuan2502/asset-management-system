import {
  Product as PrismaProduct,
  Category as PrismaCategory,
  Manufacturer as PrismaManufacturer,
  ProductAttribute as PrismaProductAttribute,
} from '@prisma/client';
import { ProductAggregate } from 'src/2_domain/product/aggregates/product.aggregate';

// Định nghĩa một kiểu dữ liệu cho đối tượng Prisma Product khi nó được query
// cùng với các mối quan hệ lồng nhau.
type PrismaProductWithRelations = PrismaProduct & {
  category?: PrismaCategory;
  manufacturer?: PrismaManufacturer;
  attributes?: PrismaProductAttribute[];
};

export class ProductMapper {
  public static toDomain(
    prismaProduct: PrismaProductWithRelations,
  ): ProductAggregate {
    const domainProduct = new ProductAggregate();

    domainProduct.id = prismaProduct.id;
    domainProduct.name = prismaProduct.name;
    domainProduct.modelNumber = prismaProduct.modelNumber;
    domainProduct.createdAt = prismaProduct.createdAt;
    domainProduct.updatedAt = prismaProduct.updatedAt;
    domainProduct.deletedAt = prismaProduct.deletedAt;

    domainProduct.categoryId = prismaProduct.categoryId;
    domainProduct.manufacturerId = prismaProduct.manufacturerId;

    return domainProduct;
  }
}
