import { UpdateManufacturerInput } from '../../dtos/update-manufacturer.input';

export class UpdateManufacturerCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateManufacturerInput,
  ) {}
}
