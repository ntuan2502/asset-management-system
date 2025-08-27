import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';
import {
  IDepartmentRepository,
  DEPARTMENT_REPOSITORY,
} from 'src/2_domain/department/repositories/department.repository.interface';
import { UpdateDepartmentCommand } from 'src/1_application/department/commands/impl/update-department.command';
import { DepartmentAggregateRepository } from 'src/2_domain/department/repositories/department-aggregate.repository';
import { DEPARTMENT_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler
  implements ICommandHandler<UpdateDepartmentCommand>
{
  constructor(
    private readonly aggregateRepository: DepartmentAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(DEPARTMENT_REPOSITORY)
    private readonly departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    command: UpdateDepartmentCommand,
  ): Promise<DepartmentAggregate> {
    const { id, payload } = command;
    const data = await this.aggregateRepository.findById(id);
    if (!data.id) {
      throw new NotFoundException(DEPARTMENT_ERRORS.NOT_FOUND(id));
    }

    if (payload.name && payload.name !== data.name) {
      const isDuplicate = await this.departmentRepository.doesNameExistInOffice(
        payload.name,
        data.officeId,
      );
      if (isDuplicate) {
        throw new Error(
          DEPARTMENT_ERRORS.ALREADY_EXISTS_IN_OFFICE(
            payload.name,
            data.officeId,
          ),
        );
      }
    }

    const expectedVersion = data.version;
    data.updateDepartment(payload);

    const events = data.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        data.id,
        data.aggregateType,
        events,
        expectedVersion,
      );
      data.commit();
    }
    return data;
  }
}
