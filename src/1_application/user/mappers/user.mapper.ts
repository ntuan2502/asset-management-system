import { User as PrismaUser } from '@prisma/client';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';

export class UserMapper {
  public static toDomain(prismaUser: PrismaUser): UserAggregate {
    const domainUser = new UserAggregate();
    domainUser.id = prismaUser.id;
    domainUser.email = prismaUser.email;
    domainUser.firstName = prismaUser.firstName;
    domainUser.lastName = prismaUser.lastName;
    return domainUser;
  }
}
