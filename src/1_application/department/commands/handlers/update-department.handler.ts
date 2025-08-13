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
    const department = await this.aggregateRepository.findById(id);
    if (!department.id) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }

    // Kiểm tra trùng lặp tên nếu tên được thay đổi
    if (payload.name && payload.name !== department.name) {
      const isDuplicate = await this.departmentRepository.doesNameExistInOffice(
        payload.name,
        department.officeId,
      );
      if (isDuplicate) {
        throw new Error(
          `Department with name "${payload.name}" already exists in this office.`,
        );
      }
    }

    const expectedVersion = department.version;
    department.updateDepartment(payload);

    const events = department.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        department.id,
        department.aggregateType,
        events,
        expectedVersion,
      );
      department.commit();
    }
    return department;
  }
}
