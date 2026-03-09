import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Tên đăng nhập' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MaxLength(100, { message: 'Tên đăng nhập tối đa 100 ký tự' })
  Username: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(255)
  PasswordHash: string;

  @ApiProperty({ example: 'John Doe', description: 'Họ và tên' })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MaxLength(150)
  FullName: string;

  @ApiPropertyOptional({ example: 'john@example.com', description: 'Email liên hệ' })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @IsOptional()
  @MaxLength(150)
  Email?: string;

  @ApiProperty({ example: 1, description: 'ID của Vai trò (Role)' })
  @IsInt({ message: 'RoleId phải là số nguyên' })
  @IsNotEmpty({ message: 'Vui lòng chọn vai trò cho người dùng' })
  RoleId: number;
}