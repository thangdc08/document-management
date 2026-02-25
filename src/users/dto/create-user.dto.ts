import { 
  IsEmail, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  MinLength, 
  MaxLength 
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên đăng nhập phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MaxLength(100, { message: 'Tên đăng nhập tối đa 100 ký tự' })
  Username: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(255)
  PasswordHash: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MaxLength(150)
  FullName: string;

  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @IsOptional()
  @MaxLength(150)
  Email?: string;

  @IsInt({ message: 'RoleId phải là số nguyên' })
  @IsNotEmpty({ message: 'Vui lòng chọn vai trò cho người dùng' })
  RoleId: number;
}