import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from '../impl/update-user.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';
import {
  DEPARTMENT_REPOSITORY,
  IDepartmentRepository,
} from 'src/2_domain/department/repositories/department.repository.interface';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly aggregateRepository: UserAggregateRepository,
    @Inject(EVENT_STORE_SERVICE)
    private readonly eventStore: IEventStore,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepo: IDepartmentRepository,
    @Inject(OFFICE_REPOSITORY) private readonly officeRepo: IOfficeRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserAggregate> {
    const { id, payload } = command;
    const user = await this.aggregateRepository.findById(id);
    if (!user.id) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    const finalOfficeId =
      payload.officeId !== undefined ? payload.officeId : user.officeId;
    const finalDepartmentId =
      payload.departmentId !== undefined
        ? payload.departmentId
        : user.departmentId;

    if (payload.officeId) {
      const office = await this.officeRepo.findById(payload.officeId);
      if (!office) {
        throw new NotFoundException(
          `Office with ID "${payload.officeId}" not found.`,
        );
      }
    }

    if (finalDepartmentId) {
      const department = await this.departmentRepo.findById(finalDepartmentId);
      if (!department) {
        throw new NotFoundException(
          `Department with ID "${finalDepartmentId}" not found.`,
        );
      }

      if (finalOfficeId && department.officeId !== finalOfficeId) {
        throw new Error(
          'Inconsistency: The specified department does not belong to the final office.',
        );
      }
    }

    const expectedVersion = user.version;
    user.updateUser(payload);

    const events = user.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        user.id,
        user.aggregateType,
        events,
        expectedVersion,
      );
      user.commit();
    }

    return user;
  }
}
