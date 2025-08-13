import { UpdateDepartmentInput } from '../../dtos/update-department.input';

export class UpdateDepartmentCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateDepartmentInput,
  ) {}
}
