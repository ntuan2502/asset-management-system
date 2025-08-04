import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RoleType } from './role.type';
import { CreateRoleInput } from 'src/1_application/role/dtos/create-role.input';
import { CreateRoleCommand } from 'src/1_application/role/commands/impl/create-role.command';
import { RoleAggregate } from 'src/2_domain/role/aggregates/role.aggregate';
import { GetAllRolesQuery } from 'src/1_application/role/queries/impl/get-all-roles.query';
import { GetRoleByIdQuery } from 'src/1_application/role/queries/impl/get-role-by-id.query';
import { AssignPermissionsToRoleInput } from 'src/1_application/role/dtos/assign-permissions-to-role.input';
import { AssignPermissionsToRoleCommand } from 'src/1_application/role/commands/impl/assign-permissions-to-role.command';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { SUBJECTS } from 'src/2_domain/auth/constants/subjects';

@Resolver(() => RoleType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class RoleResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => RoleType)
  @CheckPermissions({ action: ACTIONS.CREATE, subject: SUBJECTS.ROLE })
  async createRole(
    @Args('input') input: CreateRoleInput,
  ): Promise<RoleAggregate> {
    return this.commandBus.execute(new CreateRoleCommand(input));
  }

  @Query(() => [RoleType], { name: 'roles' })
  @CheckPermissions({ action: ACTIONS.READ, subject: SUBJECTS.ROLE })
  async getAllRoles(): Promise<RoleAggregate[]> {
    return this.queryBus.execute(new GetAllRolesQuery());
  }

  @Query(() => RoleType, { name: 'role', nullable: true })
  async getRoleById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RoleAggregate | null> {
    return this.queryBus.execute(new GetRoleByIdQuery(id));
  }

  @Mutation(() => RoleType)
  async assignPermissionsToRole(
    @Args('roleId', { type: () => ID }) roleId: string,
    @Args('input') input: AssignPermissionsToRoleInput,
  ): Promise<RoleAggregate> {
    return this.commandBus.execute(
      new AssignPermissionsToRoleCommand(roleId, input),
    );
  }
}
