import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreDepartmentCommand } from '../impl/restore-department.command';
import { DepartmentAggregateRepository } from 'src/2_domain/department/repositories/department-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { DEPARTMENT_ERRORS } from 'src/shared/constants/error-messages.constants';

@CommandHandler(RestoreDepartmentCommand)
export class RestoreDepartmentHandler
  implements ICommandHandler<RestoreDepartmentCommand>
{
  constructor(
    private readonly aggregateRepository: DepartmentAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreDepartmentCommand): Promise<void> {
    const { id } = command;
    // Tải aggregate, bao gồm cả các bản ghi đã bị soft-delete
    const department = await this.aggregateRepository.findById(id);
    if (!department.id) {
      throw new NotFoundException(DEPARTMENT_ERRORS.NOT_FOUND(id));
    }

    const expectedVersion = department.version;
    department.restoreDepartment();

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
  }
}
