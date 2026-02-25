import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Trả về lỗi nếu client gửi lên trường lạ
      transform: true, // Tự động convert kiểu dữ liệu (ví dụ: string sang number)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
