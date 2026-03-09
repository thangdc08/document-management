import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  ValidateIf,
  Min,
} from 'class-validator';
import { DocumentAction } from '../enums/document-action.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentActionDto {
  @ApiProperty({ enum: DocumentAction, example: DocumentAction.SUBMIT, description: 'Hành động thực hiện' })
  @IsEnum(DocumentAction)
  action: DocumentAction;

  //Tam thời để client truyền lên, sau này sẽ lấy từ token
  @ApiProperty({ example: 1, description: 'ID người thực hiện' })
  @IsNumber()
  userId: number;

  // Chỉ bắt buộc khi action = ASSIGN
  @ApiPropertyOptional({ example: 2, description: 'ID người mới (chỉ dùng khi action là ASSIGN)' })
  @ValidateIf((o) => o.action === DocumentAction.ASSIGN)
  @IsNumber()
  @Min(1)
  assignedTo?: number;

  @ApiPropertyOptional({ example: 'Nội dung ghi chú...', description: 'Ghi chú thêm' })
  @IsOptional()
  @IsString()
  note?: string;
}
