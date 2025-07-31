import { Module } from '@nestjs/common';
import { PrismaService } from 'src/3_infrastructure/persistence/prisma/prisma.service';
import { EVENT_STORE_SERVICE } from './event-store.interface';
import { EventStoreService } from './event-store.service';

@Module({
  providers: [
    PrismaService,
    {
      provide: EVENT_STORE_SERVICE,
      useClass: EventStoreService,
    },
  ],
  exports: [EVENT_STORE_SERVICE], // Export để các module khác có thể inject
})
export class EventStoreModule {}
