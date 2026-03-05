import { Module } from '@nestjs/common';
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
        logging: true, // Log mọi truy vấn SQL ra console
        logger: 'advanced-console',
      }),
    }),
    DocumentsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    DocumentHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
