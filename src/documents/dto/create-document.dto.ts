import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  IsNotEmpty,
  IsPositive,
  IsInt,
  Min,
  Matches,
  IsIn,
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

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'FileName tối đa 255 ký tự' })
  FileName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'FilePath tối đa 500 ký tự' })
  FilePath?: string;

  @IsOptional()
  @IsNumber({}, { message: 'FileSize phải là số' })
  @Min(1, { message: 'FileSize phải lớn hơn 0' })
  FileSize?: number;

  @IsOptional()
  @IsString()
  @IsIn([
    'pdf',
    'doc',
    'docx',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], {
    message: 'FileType chỉ chấp nhận: pdf, doc, docx',
  })
  FileType?: string;

  @IsNumber({}, { message: 'CreatedBy phải là số' })
  @IsInt({ message: 'CreatedBy phải là số nguyên' })
  @IsPositive({ message: 'CreatedBy phải > 0' })
  CreatedBy: number;

  @IsOptional()
  @IsNumber({}, { message: 'AssignedTo phải là số' })
  @IsInt({ message: 'AssignedTo phải là số nguyên' })
  @IsPositive({ message: 'AssignedTo phải > 0' })
  AssignedTo?: number;
}