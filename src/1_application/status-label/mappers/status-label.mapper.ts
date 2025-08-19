import { StatusLabel as PrismaStatusLabel } from '@prisma/client';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
export class StatusLabelMapper {
  public static toDomain(prismaLabel: PrismaStatusLabel): StatusLabelAggregate {
    const domainLabel = new StatusLabelAggregate();
    domainLabel.id = prismaLabel.id;
    domainLabel.name = prismaLabel.name;
    domainLabel.createdAt = prismaLabel.createdAt;
    domainLabel.updatedAt = prismaLabel.updatedAt;
    domainLabel.deletedAt = prismaLabel.deletedAt;
    return domainLabel;
  }
}
