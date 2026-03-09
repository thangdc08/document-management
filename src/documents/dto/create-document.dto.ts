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

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'DocumentCode không được để trống' })
  @MaxLength(50, { message: 'DocumentCode tối đa 50 ký tự' })
  DocumentCode: string;

  @IsString()
  @IsNotEmpty({ message: 'Title không được để trống' })
  @MaxLength(255, { message: 'Title tối đa 255 ký tự' })
  Title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description tối đa 1000 ký tự' })
  Description?: string;

  @IsNumber({}, { message: 'CreatedBy phải là số' })
  @IsInt({ message: 'CreatedBy phải là số nguyên' })
  @IsPositive({ message: 'CreatedBy phải > 0' })
  CreatedBy: number;

  @IsOptional()
  @IsNumber({}, { message: 'AssignedTo phải là số' })
  @IsInt({ message: 'AssignedTo phải là số nguyên' })
  @IsPositive({ message: 'AssignedTo phải > 0' })
  AssignedTo?: number;

  // danh sách file đã upload trước
  @IsOptional()
  @IsArray({ message: 'fileIds phải là mảng' })
  @IsInt({ each: true, message: 'fileId phải là số nguyên' })
  fileIds?: number[];
}