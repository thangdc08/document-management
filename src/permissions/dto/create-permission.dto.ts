import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'DOCUMENT_CREATE', description: 'Mã số quyền (Viết HOA, dùng dấu gạch dưới)' })
  @IsString({ message: 'Code phải là chuỗi' })
  @IsNotEmpty({ message: 'Code không được để trống' })
  @MaxLength(50, { message: 'Code tối đa 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message:
      'Code chỉ được viết HOA, không dấu, dùng dấu gạch dưới. Ví dụ: DOCUMENT_CREATE',
  })
  Code: string;

  @ApiProperty({ example: 'Tạo văn bản', description: 'Tên hiển thị của quyền' })
  @IsString({ message: 'Name phải là chuỗi' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @MinLength(3, { message: 'Name tối thiểu 3 ký tự' })
  @MaxLength(100, { message: 'Name tối đa 100 ký tự' })
  Name: string;

  @ApiPropertyOptional({ example: 'Cho phép người dùng tạo văn bản mới', description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString({ message: 'Description phải là chuỗi' })
  @MaxLength(500, { message: 'Description tối đa 500 ký tự' })
  Description?: string;
}