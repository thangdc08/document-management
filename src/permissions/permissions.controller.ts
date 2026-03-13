import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermission } from 'src/auth/decorators/permission.decorator';

@ApiBearerAuth()
@ApiTags('permissions')
@Controller('api/v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @RequiredPermission('PERMISSION_CREATE')
  @Post()
  @ApiOperation({ summary: 'Tạo quyền mới' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @RequiredPermission('PERMISSION_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách quyền' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @RequiredPermission('PERMISSION_DETAIL')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết quyền' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @RequiredPermission('PERMISSION_UPDATE')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin quyền' })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @RequiredPermission('PERMISSION_DELETE')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
