import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvincesResolver } from './provinces.resolver';

@Module({
  providers: [ProvincesResolver, ProvincesService],
})
export class ProvincesModule {}
