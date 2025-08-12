import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserCommand } from '../impl/create-user.command';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/2_domain/user/repositories/user.repository.interface';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { input } = command;

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);
    const user = this.publisher.mergeObjectContext(new UserAggregate());

    user.createUser({
      email: input.email,
      hashedPassword: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      dob: input.dob,
      gender: input.gender,
    });

    const events = user.getUncommittedEvents();
    await this.eventStore.saveEvents(user.id, user.aggregateType, events, 0);

    user.commit();

    return user;
  }
}
