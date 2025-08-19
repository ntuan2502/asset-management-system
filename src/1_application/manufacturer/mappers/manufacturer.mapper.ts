import { Manufacturer as PrismaManufacturer } from '@prisma/client';
import { ManufacturerAggregate } from 'src/2_domain/manufacturer/aggregates/manufacturer.aggregate';
export class ManufacturerMapper {
  public static toDomain(
    prismaManufacturer: PrismaManufacturer,
  ): ManufacturerAggregate {
    const domainManufacturer = new ManufacturerAggregate();
    domainManufacturer.id = prismaManufacturer.id;
    domainManufacturer.name = prismaManufacturer.name;
    domainManufacturer.createdAt = prismaManufacturer.createdAt;
    domainManufacturer.updatedAt = prismaManufacturer.updatedAt;
    domainManufacturer.deletedAt = prismaManufacturer.deletedAt;
    return domainManufacturer;
  }
}
