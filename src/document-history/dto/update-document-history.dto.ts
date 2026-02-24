import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentHistoryDto } from './create-document-history.dto';

export class UpdateDocumentHistoryDto extends PartialType(CreateDocumentHistoryDto) {}
