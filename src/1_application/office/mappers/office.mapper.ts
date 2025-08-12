import { Office as PrismaOffice } from '@prisma/client';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';

export class OfficeMapper {
  public static toDomain(prismaOffice: PrismaOffice): OfficeAggregate {
    const domainOffice = new OfficeAggregate();
    domainOffice.id = prismaOffice.id;
    domainOffice.name = prismaOffice.name;
    domainOffice.internationalName = prismaOffice.internationalName;
    domainOffice.shortName = prismaOffice.shortName;
    domainOffice.taxCode = prismaOffice.taxCode;
    domainOffice.address = prismaOffice.address;
    domainOffice.description = prismaOffice.description;
    domainOffice.createdAt = prismaOffice.createdAt;
    domainOffice.updatedAt = prismaOffice.updatedAt;
    domainOffice.deletedAt = prismaOffice.deletedAt;
    return domainOffice;
  }
}
