import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AttributeResolver } from 'src/0_presentation/graphql/resolvers/attribute/attribute.resolver';
import { CreateAttributeHandler } from 'src/1_application/attribute/commands/handlers/create-attribute.handler';
import { ATTRIBUTE_REPOSITORY } from './repositories/attribute.repository.interface';
import { PrismaAttributeRepository } from 'src/3_infrastructure/persistence/prisma/repositories/attribute/prisma-attribute.repository';
import { AttributeProjector } from 'src/3_infrastructure/projection/attribute.projector';
import { SharedInfrastructureModule } from 'src/3_infrastructure/shared/shared-infrastructure.module';
import { AttributeAggregateRepository } from './repositories/attribute-aggregate.repository';
import { GetAllAttributesHandler } from 'src/1_application/attribute/queries/handlers/get-all-attributes.handler';
import { GetAttributeByIdHandler } from 'src/1_application/attribute/queries/handlers/get-attribute-by-id.handler';
import { UpdateAttributeHandler } from 'src/1_application/attribute/commands/handlers/update-attribute.handler';
import { DeleteAttributeHandler } from 'src/1_application/attribute/commands/handlers/delete-attribute.handler';
import { RestoreAttributeHandler } from 'src/1_application/attribute/commands/handlers/restore-attribute.handler';
const CommandHandlers = [
  CreateAttributeHandler,
  UpdateAttributeHandler,
  DeleteAttributeHandler,
  RestoreAttributeHandler,
];
const QueryHandlers = [GetAllAttributesHandler, GetAttributeByIdHandler];
const Repositories = [
  { provide: ATTRIBUTE_REPOSITORY, useClass: PrismaAttributeRepository },
  AttributeAggregateRepository,
];
const Projectors = [AttributeProjector];
@Module({
  imports: [CqrsModule, SharedInfrastructureModule],
  providers: [
    AttributeResolver,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Repositories,
    ...Projectors,
  ],
  exports: [ATTRIBUTE_REPOSITORY],
})
export class AttributeModule {}
