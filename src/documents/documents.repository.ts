import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';
import { FilterDocumentDto } from './dto/filter-document.dto';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
    @InjectRepository(DocumentHistory)
    private readonly documentHistoryRepository: Repository<DocumentHistory>,
  ) { }

  async findAll(
    filterDto: FilterDocumentDto,
  ): Promise<{ data: Document[]; total: number }> {
    const { page, limit, keyword, status, createdBy, assignedTo, fromDate, toDate } = filterDto;

    const qb = this.repo
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.CreatedByUser', 'createdByUser')
      .leftJoinAndSelect('doc.AssignedToUser', 'assignedToUser');

    if (keyword) {
      qb.andWhere(
        '(doc.Title LIKE :keyword OR doc.DocumentCode LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status) {
      qb.andWhere('doc.Status = :status', { status });
    }

    if (createdBy) {
      qb.andWhere('doc.CreatedBy = :createdBy', { createdBy });
    }

    if (assignedTo) {
      qb.andWhere('doc.AssignedTo = :assignedTo', { assignedTo });
    }

    if (fromDate) {
      qb.andWhere('doc.CreatedAt >= :fromDate', { fromDate: new Date(fromDate) });
    }

    if (toDate) {
      qb.andWhere('doc.CreatedAt <= :toDate', { toDate: new Date(toDate) });
    }

    qb.orderBy('doc.CreatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findOneWithUsers(id: number): Promise<Document | null> {
    return this.repo.findOne({
      where: { Id: id },
      relations: ['CreatedByUser', 'AssignedToUser'],
    });
  }

  async findOneByDocumentCode(code: string): Promise<Document | null> {
    return this.repo.findOne({
      where: { DocumentCode: code },
    });
  }

  create(data: Partial<Document>): Document {
    return this.repo.create({
      ...data,
      Status: DocumentStatus.DRAFT,
    });
  }

  save(document: Document): Promise<Document> {
    return this.repo.save(document);
  }

  remove(document: Document): Promise<Document> {
    return this.repo.remove(document);
  }

  findOne(id: number): Promise<Document | null> {
    return this.repo.findOneBy({ Id: id });
  }

  findHistory(documentId: number) {
    return this.documentHistoryRepository.find({
      where: { DocumentId: documentId },
      order: { CreatedAt: 'DESC' },
    });
  }
}
