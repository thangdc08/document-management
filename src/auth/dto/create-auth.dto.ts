import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAuthDto {
    @ApiProperty({ example: 'admin', description: 'Tên đăng nhập' })
    @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
    username: string;

    @ApiProperty({ example: '123456', description: 'Mật khẩu' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;
}
