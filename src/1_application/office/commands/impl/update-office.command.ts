import { UpdateOfficeInput } from '../../dtos/update-office.input';
export class UpdateOfficeCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateOfficeInput,
  ) {}
}
