import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentRepository } from './documents.repository';
import { Document } from './entities/document.entity';
import { UsersRepository } from 'src/users/users.repository';
import { DocumentAction } from './enums/document-action.enum';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';
import { DataSource } from 'typeorm';
import { DocumentWorkflow } from './workflow/document-workflow.util';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from './enums/document-status.enum';
import { PaginationDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly usersRepository: UsersRepository,
    private readonly dataSource: DataSource,
  ) { }

  async getHistory(documentId: number) {
    return await this.documentRepository.findHistory(documentId);
  }
  async create(createDto: CreateDocumentDto): Promise<Document> {
    const existing = await this.documentRepository.findOneByDocumentCode(
      createDto.DocumentCode,
    );
    this.logger.log(`Checking existence for DocumentCode: ${createDto.DocumentCode}`, 'DocumentsService');

    if (existing) {
      throw new ConflictException('DocumentCode already exists');
    }

    if (createDto.CreatedBy) {
      const createdByUser = await this.usersRepository.findOne(
        createDto.CreatedBy,
      );

      if (!createdByUser) {
        throw new NotFoundException(
          `User with Id ${createDto.CreatedBy} not found`,
        );
      }
    }
    if (createDto.AssignedTo) {
      const assignedUser = await this.usersRepository.findOne(
        createDto.AssignedTo,
      );

      if (!assignedUser) {
        throw new NotFoundException(
          `User with Id ${createDto.AssignedTo} not found`,
        );
      }
    }

    const document = this.documentRepository.create(createDto);
    const saved = await this.documentRepository.save(document);
    this.logger.log(`Document created with ID: ${saved.Id}`, 'DocumentsService');
    return saved;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const { data, total } =
      await this.documentRepository.findAllWithUsers(paginationDto);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOneWithUsers(id);

    if (!document) {
      throw new NotFoundException(`Document with Id ${id} not found`);
    }

    return document;
  }

  async remove(id: number): Promise<{ message: string }> {
    const document = await this.findOne(id);

    await this.documentRepository.remove(document);

    return { message: 'Deleted successfully' };
  }

  async changeStatus(
    documentId: number,
    action: DocumentAction,
    fromUserId: number,
    assignedTo?: number,
    note?: string,
  ) {
    return this.dataSource.transaction(async (manager) => {
      this.logger.log(`Changing status for document ${documentId} with action ${action}`, 'DocumentsService');
      // Lock document để tránh race condition
      const document = await manager.findOne(Document, {
        where: { Id: documentId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const currentStatus = document.Status;

      // Validate workflow
      DocumentWorkflow.validateTransition(currentStatus, action);

      // Map status mới
      const newStatus = DocumentWorkflow.mapActionToStatus(
        action,
        currentStatus,
      );

      // Update document
      document.Status = newStatus;

      if (action === DocumentAction.ASSIGN && assignedTo) {
        document.AssignedTo = assignedTo;
      }

      // if (action === DocumentAction.DELETE) {
      //   document.IsDeleted = true; // nếu bạn có soft delete
      // }

      await manager.save(document);

      // Insert history
      await manager.save(DocumentHistory, {
        DocumentId: document.Id,
        Action: action,
        FromUserId: fromUserId,
        ToUserId: assignedTo ?? undefined,
        Note: note ?? undefined,
        StatusAfter: newStatus,
        CreatedAt: new Date(),
      });

      return document;
    });
  }

  async update(id: number, dto: UpdateDocumentDto, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const document = await manager.findOne(Document, {
        where: { Id: id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!document) {
        throw new NotFoundException('Document not found');
      }

      if (document.Status !== DocumentStatus.DRAFT) {
        throw new BadRequestException(
          'Document cannot be edited after submission',
        );
      }

      const oldStatus = document.Status;

      Object.assign(document, dto);

      const updated = await manager.save(Document, document);

      await manager.save(DocumentHistory, {
        Document: updated,
        Action: DocumentAction.UPDATE,
        FromUserId: userId,
        FromStatus: oldStatus,
        ToStatus: updated.Status,
        Note: 'Document updated',
      });

      return updated;
    });
  }
}
