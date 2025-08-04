import { AssignPermissionsToRoleInput } from '../../dtos/assign-permissions-to-role.input';

export class AssignPermissionsToRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly payload: AssignPermissionsToRoleInput,
  ) {}
}
