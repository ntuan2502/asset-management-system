import { LoginUserInput } from '../../dtos/login-user.input';
export class LoginCommand {
  constructor(
    public readonly input: LoginUserInput,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) {}
}
