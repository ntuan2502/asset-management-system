import { UpdateAttributeInput } from '../../dtos/update-attribute.input';
export class UpdateAttributeCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateAttributeInput,
  ) {}
}
