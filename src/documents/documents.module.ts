import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentRepository } from './documents.repository';
import { UsersModule } from 'src/users/users.module';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';
import { DocumentFile } from './entities/document-file.entity';
import { DocumentWorkflowRule } from './entities/document-workflow-rule.entity';
import { DocumentWorkflowService } from './workflow/document-workflow.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, DocumentHistory, DocumentFile, DocumentWorkflowRule]),
    UsersModule,
    RolesModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentRepository, DocumentWorkflowService],
  exports: [DocumentsService, DocumentRepository, DocumentWorkflowService],
})
export class DocumentsModule { }