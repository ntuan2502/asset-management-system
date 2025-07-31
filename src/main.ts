import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // << IMPORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // --- THÊM MỚI ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi payload thành instance của DTO class
    }),
  );
  // -----------------
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) =>
  console.error('Error during application bootstrap', err),
);
