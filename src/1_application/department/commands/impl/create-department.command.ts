import { CreateDepartmentInput } from '../../dtos/create-department.input';
export class CreateDepartmentCommand {
  constructor(public readonly input: CreateDepartmentInput) {}
}
