import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RestoreRoleCommand } from '../impl/restore-role.command';
import { RoleAggregateRepository } from 'src/2_domain/role/repositories/role-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';

@CommandHandler(RestoreRoleCommand)
export class RestoreRoleHandler implements ICommandHandler<RestoreRoleCommand> {
  constructor(
    private readonly aggregateRepository: RoleAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: RestoreRoleCommand): Promise<void> {
    const { id } = command;
    const role = await this.aggregateRepository.findById(id);
    if (!role.id) {
      throw new NotFoundException(`Role with ID "${id}" not found.`);
    }

    const expectedVersion = role.version;
    role.restoreRole();

    const events = role.getUncommittedEvents();
    if (events.length > 0) {
      await this.eventStore.saveEvents(
        role.id,
        role.aggregateType,
        events,
        expectedVersion,
      );
      role.commit();
    }
  }
}
