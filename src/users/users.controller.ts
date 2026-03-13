import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermission } from 'src/auth/decorators/permission.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @RequiredPermission('USER_CREATE')
  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @RequiredPermission('USER_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll() {
    return this.usersService.findAll();
  }

  @RequiredPermission('USER_DETAIL')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @RequiredPermission('USER_UPDATE')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @RequiredPermission('USER_DELETE')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
