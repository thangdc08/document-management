import { IsArray, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AssignPermissionsDto {
  @ApiProperty({ type: [Number], example: [1, 2, 3], description: 'Danh sách ID quyền gán cho vai trò' })
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}