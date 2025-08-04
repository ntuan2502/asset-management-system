import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // << Đánh dấu là module toàn cục
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export để các module khác có thể import nếu cần
})
export class PrismaModule {}
