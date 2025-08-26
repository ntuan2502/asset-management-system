import { CreateProductInput } from '../../dtos/create-product.input';
export class CreateProductCommand {
  constructor(public readonly input: CreateProductInput) {}
}
