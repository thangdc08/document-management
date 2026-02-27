import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
    @InjectRepository(DocumentHistory)
    private readonly documentHistoryRepository: Repository<DocumentHistory>,
  ) {}

  async findAllWithUsers(): Promise<Document[]> {
    return this.repo.find({
      relations: ['CreatedByUser', 'AssignedToUser'],
    });
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