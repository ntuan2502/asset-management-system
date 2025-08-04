import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/2_domain/auth/auth.service';
import { LoginResponse } from 'src/1_application/auth/dtos/login-response.dto';
import { LoginUserInput } from 'src/1_application/auth/dtos/login-user.input';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginUserInput): Promise<LoginResponse> {
    // 1. Validate user bằng email và password
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );

    // 2. Nếu không hợp lệ, ném lỗi
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Nếu hợp lệ, tạo và trả về access token
    return this.authService.login(user);
  }
}
