import { PartialType } from '@nestjs/swagger';
import { CreateDocumentHistoryDto } from './create-document-history.dto';

export class UpdateDocumentHistoryDto extends PartialType(CreateDocumentHistoryDto) { }
