import { Injectable } from '@nestjs/common';
import { UserAggregate } from 'src/2_domain/user/aggregates/user.aggregate';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ISnapshotStore, StoredSnapshot } from './snapshot-store.interface';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserSnapshotDto } from 'src/2_domain/user/aggregates/user-snapshot.dto';

@Injectable()
export class SnapshotStoreService implements ISnapshotStore {
  constructor(private readonly prisma: PrismaService) {}

  async getLatestSnapshot(aggregateId: string): Promise<StoredSnapshot | null> {
    const latestSnapshot = await this.prisma.snapshot.findFirst({
      where: { aggregateId },
      orderBy: { version: 'desc' },
    });

    if (!latestSnapshot) {
      return null;
    }

    const payloadDto = plainToInstance(
      UserSnapshotDto,
      latestSnapshot.payload as object,
    );

    return {
      version: latestSnapshot.version,
      payload: payloadDto,
    };
  }

  async saveSnapshot(aggregate: UserAggregate): Promise<void> {
    const snapshotPayload: UserSnapshotDto = {
      id: aggregate.id,
      email: aggregate.email,
      password: aggregate.password,
      firstName: aggregate.firstName,
      lastName: aggregate.lastName,
      dob: aggregate.dob,
      gender: aggregate.gender,
      roleIds: aggregate.roleIds,
      officeId: aggregate.officeId,
      departmentId: aggregate.departmentId,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
      deletedAt: aggregate.deletedAt,
      version: aggregate.version,
    };

    const payloadToSave = JSON.parse(
      JSON.stringify(snapshotPayload),
    ) as Prisma.JsonObject;

    await this.prisma.snapshot.upsert({
      where: {
        aggregateId_version: {
          aggregateId: aggregate.id,
          version: aggregate.version,
        },
      },
      update: {
        payload: payloadToSave,
      },
      create: {
        aggregateId: aggregate.id,
        aggregateType: 'User',
        version: aggregate.version,
        payload: payloadToSave,
      },
    });
  }
}
