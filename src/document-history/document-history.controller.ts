import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentHistoryService } from './document-history.service';
import { CreateDocumentHistoryDto } from './dto/create-document-history.dto';
import { UpdateDocumentHistoryDto } from './dto/update-document-history.dto';

@Controller('api/v1/document-history')
export class DocumentHistoryController {
  constructor(private readonly documentHistoryService: DocumentHistoryService) {}

  @Post()
  create(@Body() createDocumentHistoryDto: CreateDocumentHistoryDto) {
    return this.documentHistoryService.create(createDocumentHistoryDto);
  }

  @Get()
  findAll() {
    return this.documentHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentHistoryDto: UpdateDocumentHistoryDto) {
    return this.documentHistoryService.update(+id, updateDocumentHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentHistoryService.remove(+id);
  }
}
