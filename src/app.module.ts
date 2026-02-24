import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DocumentsModule } from './documents/documents.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { DocumentHistoryModule } from './document-history/document-history.module';
@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
    }), DocumentsModule, UsersModule, AuthModule, RolesModule, PermissionsModule, DocumentHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
