import { StatusLabel as PrismaStatusLabel } from '@prisma/client';
import { StatusLabelAggregate } from 'src/2_domain/status-label/aggregates/status-label.aggregate';
export class StatusLabelMapper {
  public static toDomain(prismaLabel: PrismaStatusLabel): StatusLabelAggregate {
    const domainStatusLabel = new StatusLabelAggregate();
    domainStatusLabel.id = prismaLabel.id;
    domainStatusLabel.name = prismaLabel.name;
    domainStatusLabel.createdAt = prismaLabel.createdAt;
    domainStatusLabel.updatedAt = prismaLabel.updatedAt;
    domainStatusLabel.deletedAt = prismaLabel.deletedAt;
    return domainStatusLabel;
  }
}
