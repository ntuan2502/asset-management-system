import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateRoleCommand } from '../impl/create-role.command';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand): Promise<RoleAggregate> {
    const { input } = command;

    const existingRole = await this.roleRepository.findByName(input.name);
    if (existingRole) {
      throw new Error(`Role with name "${input.name}" already exists.`);
    }

    const role = this.publisher.mergeObjectContext(new RoleAggregate());

    role.createRole(input);

    const events = role.getUncommittedEvents();
    await this.eventStore.saveEvents(role.id, role.aggregateType, events, 0);

    role.commit();

    return role;
  }
}
