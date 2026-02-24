import { Module } from '@nestjs/common';
import { DocumentHistoryService } from './document-history.service';
import { DocumentHistoryController } from './document-history.controller';

@Module({
  controllers: [DocumentHistoryController],
  providers: [DocumentHistoryService],
})
export class DocumentHistoryModule {}
