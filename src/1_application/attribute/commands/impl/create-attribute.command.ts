import { CreateAttributeInput } from '../../dtos/create-attribute.input';

export class CreateAttributeCommand {
  constructor(public readonly input: CreateAttributeInput) {}
}
