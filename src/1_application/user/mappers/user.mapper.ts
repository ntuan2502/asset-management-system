import {
  Department,
  Gender,
  Office,
  Prisma,
  User as PrismaUser,
  Role,
} from '@prisma/client';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

type PrismaUserWithRelations = PrismaUser & {
  office?: Office | null;
  department?: Department | null;
  roles?: Role[];
};

export class UserMapper {
  public static toDomain(prismaUser: PrismaUserWithRelations): UserAggregate {
    const domainUser = new UserAggregate();
    domainUser.id = prismaUser.id;
    domainUser.email = prismaUser.email;
    domainUser.password = prismaUser.password;
    domainUser.firstName = prismaUser.firstName;
    domainUser.lastName = prismaUser.lastName;
    domainUser.dob = prismaUser.dob;
    domainUser.gender = prismaUser.gender;
    domainUser.createdAt = prismaUser.createdAt;
    domainUser.updatedAt = prismaUser.updatedAt;
    domainUser.deletedAt = prismaUser.deletedAt;

    domainUser.roleIds = prismaUser.roles?.map((role) => role.id) ?? [];

    domainUser.officeId = prismaUser.officeId;
    domainUser.departmentId = prismaUser.departmentId;

    return domainUser;
  }

  public static toPersistence(
    domainUser: UserAggregate,
  ): Prisma.UserCreateInput {
    return {
      id: domainUser.id,
      email: domainUser.email,
      password: domainUser.password,
      firstName: domainUser.firstName,
      lastName: domainUser.lastName,
      dob: domainUser.dob,
      gender: domainUser.gender ? (domainUser.gender as Gender) : null,
    };
  }
}
