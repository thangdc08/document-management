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

@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterDocumentDto) {
    return this.documentsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Query('userId') userId: number,
  ) {
    return this.documentsService.update(id, updateDocumentDto, +userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: number,
  ) {
    return this.documentsService.remove(id, +userId);
  }

  @Patch(':id/action')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DocumentActionDto,
    // @Req() req,
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
  @Get(':id/history')
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.getHistory(id);
  }

  //Lấy các action cho phép tương ứng với status hiện tại
  @Get(':id/allowed-actions')
  async getAllowedActions(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentsService.findOne(id);
    return this.documentsService.getAllowedActions(document.Status);
  }

  //Upload file 
  @Post('/upload')
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
