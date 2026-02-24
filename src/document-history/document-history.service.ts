import { Injectable } from '@nestjs/common';
import { CreateDocumentHistoryDto } from './dto/create-document-history.dto';
import { UpdateDocumentHistoryDto } from './dto/update-document-history.dto';

@Injectable()
export class DocumentHistoryService {
  create(createDocumentHistoryDto: CreateDocumentHistoryDto) {
    return 'This action adds a new documentHistory';
  }

  findAll() {
    return `This action returns all documentHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentHistory`;
  }

  update(id: number, updateDocumentHistoryDto: UpdateDocumentHistoryDto) {
    return `This action updates a #${id} documentHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentHistory`;
  }
}
