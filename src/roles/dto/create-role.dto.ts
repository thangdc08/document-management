import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Mã số vai trò (Chỉ viết HOA, không dấu, ngăn cách bằng dấu gạch dưới)' })
  @IsString({ message: 'Code phải là chuỗi' })
  @IsNotEmpty({ message: 'Code không được để trống' })
  @MaxLength(50, { message: 'Code tối đa 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message:
      'Code chỉ được viết HOA, không dấu, dùng dấu gạch dưới. Ví dụ: ADMIN',
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  Code: string;

  @ApiProperty({ example: 'Quản trị viên', description: 'Tên hiển thị của vai trò' })
  @IsString({ message: 'Name phải là chuỗi' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @MinLength(3, { message: 'Name tối thiểu 3 ký tự' })
  @MaxLength(150, { message: 'Name tối đa 150 ký tự' })
  Name: string;

  @ApiPropertyOptional({ example: 'Có toàn quyền hệ thống', description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString({ message: 'Description phải là chuỗi' })
  @MaxLength(255, { message: 'Description tối đa 255 ký tự' })
  Description?: string;
}