import { CreateOfficeInput } from '../../dtos/create-office.input';
export class CreateOfficeCommand {
  constructor(public readonly input: CreateOfficeInput) {}
}
