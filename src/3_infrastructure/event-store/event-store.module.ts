import { Module } from '@nestjs/common';
import { EVENT_STORE_SERVICE } from './event-store.interface';
import { EventStoreService } from './event-store.service';

@Module({
  providers: [
    {
      provide: EVENT_STORE_SERVICE,
      useClass: EventStoreService,
    },
  ],
  exports: [EVENT_STORE_SERVICE],
})
export class EventStoreModule {}
