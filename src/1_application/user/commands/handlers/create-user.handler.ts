import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
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
import {
  DEPARTMENT_REPOSITORY,
  IDepartmentRepository,
} from 'src/2_domain/department/repositories/department.repository.interface';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import {
  DEPARTMENT_ERRORS,
  OFFICE_ERRORS,
  USER_ERRORS,
} from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
    @Inject(OFFICE_REPOSITORY) private readonly officeRepo: IOfficeRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const { input } = command;

    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error(USER_ERRORS.ALREADY_EXISTS(input.email));
    }

    if (input.officeId) {
      const office = await this.officeRepo.findById(input.officeId);
      if (!office) {
        throw new NotFoundException(OFFICE_ERRORS.NOT_FOUND(input.officeId));
      }
    }

    if (input.departmentId) {
      const department = await this.departmentRepo.findById(input.departmentId);
      if (!department) {
        throw new NotFoundException(
          DEPARTMENT_ERRORS.NOT_FOUND(input.departmentId),
        );
      }

      if (!input.officeId) {
        input.officeId = department.officeId;
      } else if (department.officeId !== input.officeId) {
        throw new Error(USER_ERRORS.INCONSISTENT_DEPARTMENT);
      }
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
      officeId: input.officeId,
      departmentId: input.departmentId,
    });

    const events = user.getUncommittedEvents();
    await this.eventStore.saveEvents(user.id, user.aggregateType, events, 0);

    user.commit();

    return user;
  }
}
