import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteRoleCommand } from '../impl/delete-role.command';
import { RoleAggregateRepository } from 'src/2_domain/role/repositories/role-aggregate.repository';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    private readonly aggregateRepository: RoleAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    const { id } = command;
    const role = await this.aggregateRepository.findById(id);
    if (!role.id) {
      throw new NotFoundException(`Role with ID "${id}" not found.`);
    }

    const expectedVersion = role.version;
    role.deleteRole();

    const events = role.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        role.id,
        'Role',
        events,
        expectedVersion,
      );
      role.commit();
    }
  }
}
