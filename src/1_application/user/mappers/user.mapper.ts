import { Gender, Prisma, User as PrismaUser } from '@prisma/client';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

export class UserMapper {
  public static toDomain(prismaUser: PrismaUser): UserAggregate {
    const domainUser = new UserAggregate();
    domainUser.id = prismaUser.id;
    domainUser.email = prismaUser.email;
    domainUser.password = prismaUser.password;
    domainUser.firstName = prismaUser.firstName;
    domainUser.lastName = prismaUser.lastName;
    domainUser.dob = prismaUser.dob;
    domainUser.gender = prismaUser.gender;
    domainUser.createdAt = prismaUser.createdAt; // << THÊM MỚI
    domainUser.updatedAt = prismaUser.updatedAt; // << THÊM MỚI
    return domainUser;
  }

  // --- THÊM MỚI ---
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
      // Chuyển đổi kiểu dữ liệu cho gender một cách an toàn
      gender: domainUser.gender ? (domainUser.gender as Gender) : null,
    };
  }
}
