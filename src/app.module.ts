import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from './2_domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './3_infrastructure/seeders/seeder.module';
import { PermissionModule } from './2_domain/permission/permission.module';
import { UserModule } from './2_domain/user/user.module';
import { RoleModule } from './2_domain/role/role.module';
import { PrismaModule } from './3_infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
    }),
    PrismaModule,
    UserModule,
    RoleModule,
    AuthModule,
    PermissionModule,

    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
