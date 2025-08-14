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
// Chúng ta cũng cần kiểm tra xem Office có tồn tại không
import {
  IOfficeRepository,
  OFFICE_REPOSITORY,
} from 'src/2_domain/office/repositories/office.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { OFFICE_ERRORS } from 'src/shared/constants/error-messages.constants';

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

    // Validation 1: Office phải tồn tại
    const officeExists = await this.officeRepository.findById(input.officeId);
    if (!officeExists) {
      throw new NotFoundException(OFFICE_ERRORS.NOT_FOUND(input.officeId));
    }

    // Validation 2: Tên phòng ban không được trùng trong office đó
    const isDuplicate = await this.departmentRepository.doesNameExistInOffice(
      input.name,
      input.officeId,
    );
    if (isDuplicate) {
      throw new Error(
        `Department with name "${input.name}" already exists in this office.`,
      );
    }

    const department = this.publisher.mergeObjectContext(
      new DepartmentAggregate(),
    );
    department.createDepartment(input);

    const events = department.getUncommittedEvents();
    await this.eventStore.saveEvents(
      department.id,
      department.aggregateType,
      events,
      0,
    );

    department.commit();
    return department;
  }
}
