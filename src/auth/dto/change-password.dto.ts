import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ example: '123456', description: 'Mật khẩu cũ' })
    @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
    oldPassword: string;

    @ApiProperty({ example: 'newpassword123', description: 'Mật khẩu mới' })
    @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
    @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    newPassword: string;
}
