import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  IsNotEmpty,
  IsPositive,
  IsInt,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'DOC001', description: 'Mã số văn bản' })
  @IsString()
  @IsNotEmpty({ message: 'DocumentCode không được để trống' })
  @MaxLength(50, { message: 'DocumentCode tối đa 50 ký tự' })
  DocumentCode: string;

  @ApiProperty({ example: 'Báo cáo tháng 3', description: 'Tiêu đề văn bản' })
  @IsString()
  @IsNotEmpty({ message: 'Title không được để trống' })
  @MaxLength(255, { message: 'Title tối đa 255 ký tự' })
  Title: string;

  @ApiPropertyOptional({ example: 'Nội dung báo cáo...', description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description tối đa 1000 ký tự' })
  Description?: string;

  @ApiProperty({ example: 1, description: 'ID người tạo' })
  @IsNumber({}, { message: 'CreatedBy phải là số' })
  @IsInt({ message: 'CreatedBy phải là số nguyên' })
  @IsPositive({ message: 'CreatedBy phải > 0' })
  CreatedBy: number;

  @ApiPropertyOptional({ example: 2, description: 'ID người được giao xử lý' })
  @IsOptional()
  @IsNumber({}, { message: 'AssignedTo phải là số' })
  @IsInt({ message: 'AssignedTo phải là số nguyên' })
  @IsPositive({ message: 'AssignedTo phải > 0' })
  AssignedTo?: number;

  // danh sách file đã upload trước
  @ApiPropertyOptional({ type: [Number], example: [1, 2], description: 'Danh sách ID file đính kèm' })
  @IsOptional()
  @IsArray({ message: 'fileIds phải là mảng' })
  @IsInt({ each: true, message: 'fileId phải là số nguyên' })
  fileIds?: number[];
}