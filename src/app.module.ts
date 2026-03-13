import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { DocumentHistoryModule } from './document-history/document-history.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './common/configs/logger.config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionGuard } from './auth/guards/permission.guard';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    WinstonModule.forRoot(loggerConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // Set to false in production
        extra: {
          options: {
            encrypt: false,
            trustServerCertificate: true, // Set to true for local development
          },
        },
        logging: ['error'], // Chỉ log lỗi, tắt hiển thị lệnh SQL
        logger: 'advanced-console',
      }),
    }),
    DocumentsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    DocumentHistoryModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // JwtAuthGuard phải đứng trước PermissionGuard để Guard có thể lấy user từ request
    // Gắn JwtAuthGuard toàn cục: mọi route đều cần đăng nhập, trừ @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Gắn PermissionGuard toàn cục: chạy SAU JwtAuthGuard (thứ tự providers = thứ tự chạy)
    // Cần JwtAuthGuard chạy trước để request.user đã có sẵn
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule { }
