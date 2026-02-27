import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString({ message: 'Code phải là chuỗi' })
  @IsNotEmpty({ message: 'Code không được để trống' })
  @MaxLength(50, { message: 'Code tối đa 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message:
      'Code chỉ được viết HOA, không dấu, dùng dấu gạch dưới. Ví dụ: DOCUMENT_CREATE',
  })
  Code: string;

  @IsString({ message: 'Name phải là chuỗi' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @MinLength(3, { message: 'Name tối thiểu 3 ký tự' })
  @MaxLength(100, { message: 'Name tối đa 100 ký tự' })
  Name: string;

  @IsOptional()
  @IsString({ message: 'Description phải là chuỗi' })
  @MaxLength(500, { message: 'Description tối đa 500 ký tự' })
  Description?: string;
}