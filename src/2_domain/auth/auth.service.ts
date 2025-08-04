import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserWithPermissions,
} from 'src/2_domain/user/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithPermissions | null> {
    const user = await this.userRepository.findWithPermissionsByEmail(email);

    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result as UserWithPermissions;
    }
    return null;
  }

  login(user: UserWithPermissions) {
    const payload = {
      sub: user.id,
      permissions: user.permissions,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
