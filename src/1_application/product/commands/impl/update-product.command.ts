import { UpdateProductInput } from '../../dtos/update-product.input';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateProductInput,
  ) {}
}
