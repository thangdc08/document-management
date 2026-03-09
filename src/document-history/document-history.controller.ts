import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentHistoryService } from './document-history.service';
import { CreateDocumentHistoryDto } from './dto/create-document-history.dto';
import { UpdateDocumentHistoryDto } from './dto/update-document-history.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('document-history')
@Controller('api/v1/document-history')
export class DocumentHistoryController {
  constructor(private readonly documentHistoryService: DocumentHistoryService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo lịch sử văn bản mới (Hệ thống tự động dùng)' })
  create(@Body() createDocumentHistoryDto: CreateDocumentHistoryDto) {
    return this.documentHistoryService.create(createDocumentHistoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách lịch sử' })
  findAll() {
    return this.documentHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bản ghi lịch sử' })
  findOne(@Param('id') id: string) {
    return this.documentHistoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bản ghi lịch sử' })
  update(@Param('id') id: string, @Body() updateDocumentHistoryDto: UpdateDocumentHistoryDto) {
    return this.documentHistoryService.update(+id, updateDocumentHistoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi lịch sử' })
  remove(@Param('id') id: string) {
    return this.documentHistoryService.remove(+id);
  }
}
