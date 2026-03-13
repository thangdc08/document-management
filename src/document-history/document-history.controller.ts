import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentHistoryService } from './document-history.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequiredPermission } from 'src/auth/decorators/permission.decorator';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth()
@ApiTags('document-history')
@Controller('api/v1/document-history')
export class DocumentHistoryController {
  constructor(private readonly documentHistoryService: DocumentHistoryService) { }

  @RequiredPermission('HISTORY_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách lịch sử' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.documentHistoryService.findAll(paginationDto);
  }

  @RequiredPermission('HISTORY_VIEW')
  @Get('document/:documentId')
  @ApiOperation({ summary: 'Lấy lịch sử của một văn bản cụ thể' })
  findByDocument(
    @Param('documentId') documentId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.documentHistoryService.findByDocument(+documentId, paginationDto);
  }

  @RequiredPermission('HISTORY_DETAIL')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bản ghi lịch sử' })
  findOne(@Param('id') id: string) {
    return this.documentHistoryService.findOne(+id);
  }

}
