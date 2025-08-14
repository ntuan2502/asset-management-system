import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AssignPermissionsToRoleCommand } from '../impl/assign-permissions-to-role.command';
import {
  IEventStore,
  EVENT_STORE_SERVICE,
} from 'src/3_infrastructure/event-store/event-store.interface';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { RoleAggregateRepository } from 'src/2_domain/role/repositories/role-aggregate.repository';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import {
  PERMISSION_ERRORS,
  ROLE_ERRORS,
} from 'src/shared/constants/error-messages.constants';

@CommandHandler(AssignPermissionsToRoleCommand)
export class AssignPermissionsToRoleHandler
  implements ICommandHandler<AssignPermissionsToRoleCommand>
{
  constructor(
    private readonly aggregateRepository: RoleAggregateRepository,
    @Inject(EVENT_STORE_SERVICE) private readonly eventStore: IEventStore,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: AssignPermissionsToRoleCommand,
  ): Promise<RoleAggregate> {
    const { roleId, payload } = command;

    const permissionsCount = await this.prisma.permission.count({
      where: {
        id: { in: payload.permissionIds },
      },
    });
    if (permissionsCount !== payload.permissionIds.length) {
      throw new Error(PERMISSION_ERRORS.INVALID_IDS);
    }

    const role = await this.aggregateRepository.findById(roleId);
    if (!role.id) {
      throw new NotFoundException(ROLE_ERRORS.NOT_FOUND(roleId));
    }

    const expectedVersion = role.version;
    role.assignPermissions(payload.permissionIds);

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
