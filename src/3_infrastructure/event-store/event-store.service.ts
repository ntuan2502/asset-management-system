import { Injectable } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { ConcurrencyException } from 'src/shared/exceptions/concurrency.exception';
import { IEventStore, StoredEvent } from './event-store.interface';

@Injectable()
export class EventStoreService implements IEventStore {
  constructor(private readonly prisma: PrismaService) {}

  async saveEvents(
    aggregateId: string,
    aggregateType: string,
    events: IEvent[],
    expectedVersion: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Lấy phiên bản hiện tại của aggregate từ DB
      const latestEvent = await tx.event.findFirst({
        where: { aggregateId },
        orderBy: { version: 'desc' },
      });
      const currentVersion = latestEvent?.version ?? 0;

      // 2. Kiểm tra xung đột phiên bản (Optimistic Concurrency Control)
      if (currentVersion !== expectedVersion) {
        throw new ConcurrencyException(
          `Concurrency error for aggregate ${aggregateId}. Expected version ${expectedVersion} but was ${currentVersion}`,
        );
      }

      // 3. Chuẩn bị dữ liệu để lưu
      let version = currentVersion;
      const eventsToSave = events.map((event) => {
        version++;
        return {
          aggregateId,
          aggregateType,
          eventType: event.constructor.name,
          payload: event,
          version,
        };
      });

      // 4. Lưu các sự kiện mới
      await tx.event.createMany({
        data: eventsToSave,
      });
    });
  }

  async getEventsForAggregate(aggregateId: string): Promise<StoredEvent[]> {
    return this.prisma.event.findMany({
      where: { aggregateId },
      orderBy: { version: 'asc' }, // QUAN TRỌNG: Luôn lấy theo thứ tự tăng dần của version
    });
  }
}
