import { UpdateCategoryInput } from '../../dtos/update-category.input';

export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateCategoryInput,
  ) {}
}
