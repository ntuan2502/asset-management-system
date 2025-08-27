import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateDepartmentCommand } from '../impl/create-department.command';
import {
  IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from 'src/2_domain/department/repositories/department.repository.interface';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import { NotFoundException } from '@nestjs/common';
import {
  DEPARTMENT_ERRORS,
  OFFICE_ERRORS,
} from 'src/shared/constants/error-messages.constants';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler
  implements ICommandHandler<CreateDepartmentCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepository: IOfficeRepository,
  ) {}

  async execute(
    command: CreateDepartmentCommand,
  ): Promise<DepartmentAggregate> {
    const { input } = command;

    const officeExists = await this.officeRepository.findById(input.officeId);
    if (!officeExists) {
      throw new NotFoundException(OFFICE_ERRORS.NOT_FOUND(input.officeId));
    }

    const isDuplicate = await this.departmentRepository.doesNameExistInOffice(
      input.name,
      input.officeId,
    );
    if (isDuplicate) {
      throw new Error(
        DEPARTMENT_ERRORS.ALREADY_EXISTS_IN_OFFICE(input.name, input.officeId),
      );
    }

    const data = this.publisher.mergeObjectContext(new DepartmentAggregate());
    data.createDepartment(input);

    const events = data.getUncommittedEvents();
    await this.eventStore.saveEvents(data.id, data.aggregateType, events, 0);

    data.commit();
    return data;
  }
}
