import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('api/v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo quyền mới' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách quyền' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết quyền' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin quyền' })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
