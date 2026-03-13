import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentHistoryService } from './document-history.service';
import { DocumentHistoryController } from './document-history.controller';
import { DocumentHistory } from './entities/document-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentHistory])],
  controllers: [DocumentHistoryController],
  providers: [DocumentHistoryService],
})
export class DocumentHistoryModule { }
