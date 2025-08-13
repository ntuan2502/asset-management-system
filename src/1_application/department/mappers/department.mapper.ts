import {
  Department as PrismaDepartment,
  Office as PrismaOffice,
} from '@prisma/client';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';

// Kiểu dữ liệu Prisma trả về khi include
type PrismaDepartmentWithOffice = PrismaDepartment & { office?: PrismaOffice };

export class DepartmentMapper {
  public static toDomain(
    prismaDept: PrismaDepartmentWithOffice,
  ): DepartmentAggregate {
    const domainDept = new DepartmentAggregate();
    domainDept.id = prismaDept.id;
    domainDept.name = prismaDept.name;
    domainDept.officeId = prismaDept.officeId;
    domainDept.description = prismaDept.description;
    domainDept.createdAt = prismaDept.createdAt;
    domainDept.updatedAt = prismaDept.updatedAt;
    domainDept.deletedAt = prismaDept.deletedAt;
    return domainDept;
  }
}
