import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentActionDto } from './dto/document-action.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
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
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
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
}
