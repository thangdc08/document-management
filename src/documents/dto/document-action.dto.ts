import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  ValidateIf,
  Min,
} from 'class-validator';
import { DocumentAction } from '../enums/document-action.enum';

export class DocumentActionDto {
  @IsEnum(DocumentAction)
  action: DocumentAction;

  //Tam thời để client truyền lên, sau này sẽ lấy từ token
  @IsNumber()
  userId: number;
  // Chỉ bắt buộc khi action = ASSIGN
  @ValidateIf((o) => o.action === DocumentAction.ASSIGN)
  @IsNumber()
  @Min(1)
  assignedTo?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
