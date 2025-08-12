import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateRoleCommand } from '../impl/update-role.command';
import { RoleAggregateRepository } from 'src/2_domain/role/repositories/role-aggregate.repository';
import {
  EVENT_STORE_SERVICE,
  IEventStore,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    private readonly aggregateRepository: RoleAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateRoleCommand): Promise<RoleAggregate> {
    const { id, payload } = command;
    const role = await this.aggregateRepository.findById(id);
    if (!role.id) {
      throw new NotFoundException(`Role with ID "${id}" not found.`);
    }

    const expectedVersion = role.version;
    role.updateRole(payload);

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
    return role;
  }
}
