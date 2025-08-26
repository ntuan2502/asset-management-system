import {
  Department as PrismaDepartment,
  Office as PrismaOffice,
} from '@prisma/client';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';

// Kiểu dữ liệu Prisma trả về khi include
type PrismaDepartmentWithOffice = PrismaDepartment & { office?: PrismaOffice };

export class DepartmentMapper {
  public static toDomain(
    prismaDepartment: PrismaDepartmentWithOffice,
  ): DepartmentAggregate {
    const domainDepartment = new DepartmentAggregate();
    domainDepartment.id = prismaDepartment.id;
    domainDepartment.name = prismaDepartment.name;
    domainDepartment.officeId = prismaDepartment.officeId;
    domainDepartment.description = prismaDepartment.description;
    domainDepartment.createdAt = prismaDepartment.createdAt;
    domainDepartment.updatedAt = prismaDepartment.updatedAt;
    domainDepartment.deletedAt = prismaDepartment.deletedAt;
    return domainDepartment;
  }
}
