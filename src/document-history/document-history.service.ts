import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentHistory } from './entities/document-history.entity';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';
import { ResultPaginationDTO } from 'src/common/dto/result-pagination.dto';

@Injectable()
export class DocumentHistoryService {
  constructor(
    @InjectRepository(DocumentHistory)
    private readonly historyRepository: Repository<DocumentHistory>,
  ) { }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const [data, total] = await this.historyRepository.findAndCount({
      relations: ['FromUser', 'ToUser'],
      order: { CreatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new ResultPaginationDTO(data, total, page, limit);
  }

  async findByDocument(documentId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const [data, total] = await this.historyRepository.findAndCount({
      where: { DocumentId: documentId },
      relations: ['FromUser', 'ToUser'],
      order: { CreatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new ResultPaginationDTO(data, total, page, limit);
  }

  async findOne(id: number) {
    const history = await this.historyRepository.findOne({
      where: { Id: id },
      relations: ['FromUser', 'ToUser'],
    });
    if (!history) {
      throw new NotFoundException(`History record with ID ${id} not found`);
    }
    return history;
  }

}
