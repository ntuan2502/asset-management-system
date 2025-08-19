import { UpdateStatusLabelInput } from '../../dtos/update-status-label.input';

export class UpdateStatusLabelCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateStatusLabelInput,
  ) {}
}
