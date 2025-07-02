import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Chuyển type đúng với class
      whitelist: true, // Loại bỏ field lạ
      forbidNonWhitelisted: true, // Cảnh báo field không khai báo
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) =>
  console.error('Error during application bootstrap', err),
);
