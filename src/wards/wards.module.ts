import { Module } from '@nestjs/common';
import { WardsService } from './wards.service';
import { WardsResolver } from './wards.resolver';

@Module({
  providers: [WardsResolver, WardsService],
})
export class WardsModule {}
