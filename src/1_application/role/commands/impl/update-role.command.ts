import { UpdateRoleInput } from '../../dtos/update-role.input';
export class UpdateRoleCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateRoleInput,
  ) {}
}
