import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AssignRoleToUserCommand } from '../impl/assign-role-to-user.command';
import { UserAggregateRepository } from 'src/2_domain/user/repositories/user-aggregate.repository';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import {
  IRoleRepository,
  ROLE_REPOSITORY,
} from 'src/2_domain/role/repositories/role.repository.interface';
import {
  ROLE_ERRORS,
  USER_ERRORS,
} from 'src/shared/constants/error-messages.constants';

@CommandHandler(AssignRoleToUserCommand)
export class AssignRoleToUserHandler
  implements ICommandHandler<AssignRoleToUserCommand>
{
  constructor(
    private readonly userAggregateRepository: UserAggregateRepository,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: AssignRoleToUserCommand): Promise<UserAggregate> {
    const { userId, roleId } = command;

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException(ROLE_ERRORS.NOT_FOUND(roleId));
    }

    const data = await this.userAggregateRepository.findById(userId);
    if (!data.id) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(userId));
    }

    const expectedVersion = data.version;
    data.assignRole(roleId);

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
