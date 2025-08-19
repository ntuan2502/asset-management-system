import { CreateCategoryInput } from '../../dtos/create-category.input';

export class CreateCategoryCommand {
  constructor(public readonly input: CreateCategoryInput) {}
}
