import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserWithPermissions,
} from 'src/2_domain/user/repositories/user.repository.interface';
import { AppPermission } from '../constants/app-permissions';

interface JwtPayload {
  sub: string;
  permissions: AppPermission[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserWithPermissions> {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    (user as UserWithPermissions).permissions = payload.permissions;
    return user as UserWithPermissions;
  }
}
