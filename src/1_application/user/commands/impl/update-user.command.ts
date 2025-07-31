import { UpdateUserInput } from '../../dtos/update-user.input';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateUserInput,
  ) {}
}
