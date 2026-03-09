import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './common/configs/logger.config';
import { setupSwagger } from './common/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  // Cấu hình Swagger
  setupSwagger(app);

  // Cấu hình ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Trả về lỗi nếu client gửi lên trường lạ
      transform: true, // Tự động convert kiểu dữ liệu (ví dụ: string sang number)
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
