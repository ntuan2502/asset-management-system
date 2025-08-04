import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LoginResponse } from 'src/1_application/auth/dtos/login-response.dto';
import { LoginUserInput } from 'src/1_application/auth/dtos/login-user.input';
import { UnauthorizedException } from '@nestjs/common';
import { UserWithPermissions } from 'src/2_domain/user/repositories/user.repository.interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginUserInput): Promise<LoginResponse> {
    const user: UserWithPermissions | null =
      await this.authService.validateUser(input.email, input.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
