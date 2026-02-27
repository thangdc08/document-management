import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString({ message: 'Code phải là chuỗi' })
  @IsNotEmpty({ message: 'Code không được để trống' })
  @MaxLength(50, { message: 'Code tối đa 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message:
      'Code chỉ được viết HOA, không dấu, dùng dấu gạch dưới. Ví dụ: ADMIN',
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  Code: string;

  @IsString({ message: 'Name phải là chuỗi' })
  @IsNotEmpty({ message: 'Name không được để trống' })
  @MinLength(3, { message: 'Name tối thiểu 3 ký tự' })
  @MaxLength(150, { message: 'Name tối đa 150 ký tự' })
  Name: string;

  @IsOptional()
  @IsString({ message: 'Description phải là chuỗi' })
  @MaxLength(255, { message: 'Description tối đa 255 ký tự' })
  Description?: string;
}