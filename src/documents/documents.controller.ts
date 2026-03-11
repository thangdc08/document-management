import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentActionDto } from './dto/document-action.dto';
import { FilterDocumentDto } from './dto/filter-document.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/configs/multer.config';
import { UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { RequiredPermission } from 'src/auth/decorators/permission.decorator';

@ApiTags('documents')
@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @RequiredPermission('DOC_CREATE')
  @Post()
  @ApiOperation({ summary: 'Tạo mới văn bản' })
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @RequiredPermission('DOC_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách văn bản (có phân trang/lọc)' })
  findAll(@Query() filterDto: FilterDocumentDto) {
    return this.documentsService.findAll(filterDto);
  }

  @RequiredPermission('DOC_DETAIL')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một văn bản' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @RequiredPermission('DOC_UPDATE')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin văn bản (chỉ khi là DRAFT)' })
  @ApiQuery({ name: 'userId', type: Number, description: 'ID người thực hiện' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Query('userId') userId: number,
  ) {
    return this.documentsService.update(id, updateDocumentDto, +userId);
  }

  @RequiredPermission('DOC_DELETE')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa văn bản' })
  @ApiQuery({ name: 'userId', type: Number, description: 'ID người thực hiện' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: number,
  ) {
    return this.documentsService.remove(id, +userId);
  }

  @RequiredPermission('DOC_WORKFLOW')
  @Patch(':id/action')
  @ApiOperation({ summary: 'Thực hiện hành động workflow (Gửi, Duyệt, Giao xử lý...)' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DocumentActionDto,
  ) {
    return this.documentsService.changeStatus(
      id,
      dto.action,
      dto.userId,
      dto.assignedTo,
      dto.note,
    );
  }

  //Lấy lịch sử của document
  @RequiredPermission('DOC_HISTORY')
  @Get(':id/history')
  @ApiOperation({ summary: 'Lấy lịch sử thay đổi của văn bản' })
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.getHistory(id);
  }

  //Lấy các action cho phép tương ứng với status hiện tại
  @RequiredPermission('DOC_ALLOWED_ACTIONS')
  @Get(':id/allowed-actions')
  @ApiOperation({ summary: 'Lấy các hành động được phép dựa trên trạng thái hiện tại' })
  @ApiQuery({ name: 'userId', type: Number, description: 'ID người dùng để kiểm tra quyền' })
  async getAllowedActions(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    const document = await this.documentsService.findOne(id);
    return this.documentsService.getAllowedActions(document.Status, userId);
  }

  //Upload file 
  @RequiredPermission('DOC_UPLOAD')
  @Post('/upload')
  @ApiOperation({ summary: 'Upload nhiều file đính kèm' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file', 10, multerOptions))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const results: any[] = [];
    for (const file of files) {
      const result = await this.documentsService.uploadFile(file, 1);
      results.push(result);
    }
    return results;
  }
}
