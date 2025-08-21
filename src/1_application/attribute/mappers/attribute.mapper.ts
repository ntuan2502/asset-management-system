import { Attribute as PrismaAttribute } from '@prisma/client';
import { AttributeAggregate } from 'src/2_domain/attribute/aggregates/attribute.aggregate';
import { ValueTypeEnum } from 'src/2_domain/attribute/enums/value-type.enum';

export class AttributeMapper {
  public static toDomain(prismaAttribute: PrismaAttribute): AttributeAggregate {
    const domainAttribute = new AttributeAggregate();
    domainAttribute.id = prismaAttribute.id;
    domainAttribute.name = prismaAttribute.name;
    domainAttribute.unit = prismaAttribute.unit;
    domainAttribute.valueType = prismaAttribute.valueType as ValueTypeEnum;
    domainAttribute.createdAt = prismaAttribute.createdAt;
    domainAttribute.updatedAt = prismaAttribute.updatedAt;
    domainAttribute.deletedAt = prismaAttribute.deletedAt;
    return domainAttribute;
  }
}
