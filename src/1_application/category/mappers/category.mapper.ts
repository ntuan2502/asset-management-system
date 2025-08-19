import { Category as PrismaCategory } from '@prisma/client';
import { CategoryAggregate } from 'src/2_domain/category/aggregates/category.aggregate';
export class CategoryMapper {
  public static toDomain(prismaCategory: PrismaCategory): CategoryAggregate {
    const domainCategory = new CategoryAggregate();
    domainCategory.id = prismaCategory.id;
    domainCategory.name = prismaCategory.name;
    domainCategory.createdAt = prismaCategory.createdAt;
    domainCategory.updatedAt = prismaCategory.updatedAt;
    domainCategory.deletedAt = prismaCategory.deletedAt;
    return domainCategory;
  }
}
