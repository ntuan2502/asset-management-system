import { CreateManufacturerInput } from '../../dtos/create-manufacturer.input';

export class CreateManufacturerCommand {
  constructor(public readonly input: CreateManufacturerInput) {}
}
