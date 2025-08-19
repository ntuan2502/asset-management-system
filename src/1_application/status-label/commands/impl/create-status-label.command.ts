import { CreateStatusLabelInput } from '../../dtos/create-status-label.input';

export class CreateStatusLabelCommand {
  constructor(public readonly input: CreateStatusLabelInput) {}
}
