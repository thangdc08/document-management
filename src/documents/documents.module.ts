import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentRepository } from './documents.repository';
import { UsersModule } from 'src/users/users.module';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';
import { DocumentFile } from './entities/document-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentHistory, DocumentHistory, DocumentFile]),UsersModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentRepository],
  exports: [DocumentsService, DocumentRepository],
})
export class DocumentsModule { }