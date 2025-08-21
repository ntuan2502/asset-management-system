import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { DepartmentType } from './department.type';
import { CreateDepartmentInput } from 'src/1_application/department/dtos/create-department.input';
import { CreateDepartmentCommand } from 'src/1_application/department/commands/impl/create-department.command';
import { DepartmentAggregate } from 'src/2_domain/department/aggregates/department.aggregate';
import { GqlAuthGuard } from 'src/2_domain/auth/guards/gql-auth.guard';
import { PermissionsGuard } from 'src/2_domain/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/2_domain/auth/decorators/check-permissions.decorator';
import { ENTITY_SUBJECTS } from 'src/2_domain/auth/constants/subjects';
import { ACTIONS } from 'src/2_domain/auth/constants/actions';
import { OfficeType } from '../office/office.type';
import { OfficeAggregate } from 'src/2_domain/office/aggregates/office.aggregate';
import { GetOfficeByIdQuery } from 'src/1_application/office/queries/impl/get-office-by-id.query';
import { UpdateDepartmentInput } from 'src/1_application/department/dtos/update-department.input';
import { UpdateDepartmentCommand } from 'src/1_application/department/commands/impl/update-department.command';
import { DeleteDepartmentCommand } from 'src/1_application/department/commands/impl/delete-department.command';
import { RestoreDepartmentCommand } from 'src/1_application/department/commands/impl/restore-department.command';
import { DepartmentConnection } from './department-connection.type';
import { PaginationArgs } from 'src/shared/dtos/pagination-args.dto';
import { PaginatedDepartmentsResult } from 'src/1_application/department/queries/handlers/get-all-departments.handler';
import { GetAllDepartmentsQuery } from 'src/1_application/department/queries/impl/get-all-departments.query';
import { GetDepartmentByIdQuery } from 'src/1_application/department/queries/impl/get-department-by-id.query';

@Resolver(() => DepartmentType)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class DepartmentResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => DepartmentType)
  @CheckPermissions({
    action: ACTIONS.CREATE,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async createDepartment(
    @Args('input') input: CreateDepartmentInput,
  ): Promise<DepartmentAggregate> {
    return this.commandBus.execute(new CreateDepartmentCommand(input));
  }

  @Query(() => DepartmentConnection, { name: 'departments' })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async getAllDepartments(
    @Args() args: PaginationArgs,
  ): Promise<PaginatedDepartmentsResult> {
    return this.queryBus.execute(new GetAllDepartmentsQuery(args));
  }

  @Query(() => DepartmentType, { name: 'department', nullable: true })
  @CheckPermissions({
    action: ACTIONS.READ,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async getDepartmentById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DepartmentAggregate | null> {
    return this.queryBus.execute(new GetDepartmentByIdQuery(id));
  }

  @Mutation(() => DepartmentType)
  @CheckPermissions({
    action: ACTIONS.UPDATE,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async updateDepartment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateDepartmentInput,
  ): Promise<DepartmentAggregate> {
    return this.commandBus.execute(new UpdateDepartmentCommand(id, input));
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.DELETE,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async deleteDepartment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteDepartmentCommand(id));
    return true;
  }

  @Mutation(() => Boolean)
  @CheckPermissions({
    action: ACTIONS.RESTORE,
    subject: ENTITY_SUBJECTS.DEPARTMENT,
  })
  async restoreDepartment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new RestoreDepartmentCommand(id));
    return true;
  }

  @ResolveField('office', () => OfficeType)
  async getOffice(
    @Parent() department: DepartmentAggregate,
  ): Promise<OfficeAggregate | null> {
    const officeId = department.officeId;
    return this.queryBus.execute(new GetOfficeByIdQuery(officeId));
  }
}
