import { CreateRoleInput } from '../../dtos/create-role.input';

export class CreateRoleCommand {
  constructor(public readonly input: CreateRoleInput) {}
}
