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

    // Validation: Kiểm tra xem tên vai trò đã tồn tại chưa (trên Read Model)
    const existingRole = await this.roleRepository.findByName(input.name);
    if (existingRole) {
      throw new Error(`Role with name "${input.name}" already exists.`);
    }

    // Kết nối Aggregate với EventBus
    const role = this.publisher.mergeObjectContext(new RoleAggregate());

    // Thực thi logic nghiệp vụ
    role.createRole(input.name, input.description);

    // Lưu sự kiện
    const events = role.getUncommittedEvents();
    await this.eventStore.saveEvents(role.id, 'Role', events, 0);

    // Commit và Publish
    role.commit();

    return role;
  }
}
