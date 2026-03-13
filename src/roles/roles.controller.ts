import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/AssignPermissionsDto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermission } from 'src/auth/decorators/permission.decorator';

@ApiBearerAuth()
@ApiTags('roles')
@Controller('api/v1/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @RequiredPermission('ROLE_CREATE')
  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @RequiredPermission('ROLE_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách vai trò' })
  findAll() {
    return this.rolesService.findAll();
  }

  @RequiredPermission('ROLE_DETAIL')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết vai trò' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @RequiredPermission('ROLE_UPDATE')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin vai trò' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @RequiredPermission('ROLE_DELETE')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @RequiredPermission('ROLE_DEACTIVATE')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Vô hiệu hóa vai trò (Soft Delete)' })
  deactivate(@Param('id') id: number) {
    return this.rolesService.softDelete(+id);
  }

  // Gán quyền cho vai trò
  @RequiredPermission('ROLE_ASSIGN_PERMISSIONS')
  @Patch('/permissions')
  @ApiOperation({ summary: 'Gán danh sách quyền cho vai trò' })
  assignPermissions(
    @Req() req: any,
    @Body() permissionIds: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(req.user.RoleId, permissionIds.permissionIds);
  }
}
