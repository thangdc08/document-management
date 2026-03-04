import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { DocumentRepository } from './documents.repository';
import { UsersRepository } from 'src/users/users.repository';
import { DataSource, EntityManager } from 'typeorm';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentAction } from './enums/document-action.enum';
import { Document } from './entities/document.entity';
import { DocumentHistory } from 'src/document-history/entities/document-history.entity';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let documentRepository: jest.Mocked<DocumentRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const mockDocumentRepository = {
      findHistory: jest.fn(),
      findOneByDocumentCode: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findAllWithUsers: jest.fn(),
      findOneWithUsers: jest.fn(),
      remove: jest.fn(),
    };

    const mockUsersRepository = {
      findOne: jest.fn(),
    };

    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: DocumentRepository, useValue: mockDocumentRepository },
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentRepository = module.get(DocumentRepository);
    usersRepository = module.get(UsersRepository);
    dataSource = module.get(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHistory', () => {
    it('should return document history', async () => {
      const history = [{ id: 1 }] as any;
      documentRepository.findHistory.mockResolvedValue(history);

      const result = await service.getHistory(1);
      expect(result).toEqual(history);
      expect(documentRepository.findHistory).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    const createDto = { DocumentCode: 'DOC123', Title: 'Test', CreatedBy: 1 };

    it('should create a document successfully', async () => {
      documentRepository.findOneByDocumentCode.mockResolvedValue(null);
      usersRepository.findOne.mockResolvedValue({ id: 1 } as any);
      const document = { ...createDto, id: 1 } as any;
      documentRepository.create.mockReturnValue(document);
      documentRepository.save.mockResolvedValue(document);

      const result = await service.create(createDto as any);
      expect(result).toEqual(document);
    });

    it('should throw ConflictException if DocumentCode exists', async () => {
      documentRepository.findOneByDocumentCode.mockResolvedValue({ id: 1 } as any);
      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if CreatedBy user not found', async () => {
      documentRepository.findOneByDocumentCode.mockResolvedValue(null);
      usersRepository.findOne.mockResolvedValue(null);
      await expect(service.create(createDto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if AssignedTo user not found', async () => {
      const dtoWithAssigned = { ...createDto, AssignedTo: 2 };
      documentRepository.findOneByDocumentCode.mockResolvedValue(null);
      usersRepository.findOne.mockReturnValueOnce(Promise.resolve({ id: 1 } as any)); // CreatedBy
      usersRepository.findOne.mockReturnValueOnce(Promise.resolve(null)); // AssignedTo
      await expect(service.create(dtoWithAssigned as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated documents', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const data = [{ id: 1 }] as any;
      documentRepository.findAllWithUsers.mockResolvedValue({ data, total: 1 });

      const result = await service.findAll(paginationDto as any);
      expect(result.data).toEqual(data);
      expect(result.meta.totalItems).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a document', async () => {
      const document = { id: 1 } as any;
      documentRepository.findOneWithUsers.mockResolvedValue(document);

      const result = await service.findOne(1);
      expect(result).toEqual(document);
    });

    it('should throw NotFoundException if document not found', async () => {
      documentRepository.findOneWithUsers.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      const document = { id: 1 } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(document);
      documentRepository.remove.mockResolvedValue(document);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });

  describe('changeStatus', () => {
    it('should change status successfully', async () => {
      const document = { Id: 1, Status: DocumentStatus.DRAFT } as any;
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
        save: jest.fn().mockResolvedValue(document),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      const result = await service.changeStatus(1, DocumentAction.SUBMIT, 1);
      expect(result.Status).toBe(DocumentStatus.SUBMITTED);
      expect(manager.save).toHaveBeenCalled();
    });

    it('should update AssignedTo when action is ASSIGN', async () => {
      const document = { Id: 1, Status: DocumentStatus.SUBMITTED } as any;
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
        save: jest.fn().mockResolvedValue(document),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      const result = await service.changeStatus(1, DocumentAction.ASSIGN, 1, 2);
      expect(result.Status).toBe(DocumentStatus.ASSIGNED);
      expect(result.AssignedTo).toBe(2);
    });

    it('should throw NotFoundException if document not found', async () => {
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      await expect(service.changeStatus(1, DocumentAction.SUBMIT, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid transition', async () => {
      const document = { Id: 1, Status: DocumentStatus.CLOSED } as any;
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      await expect(service.changeStatus(1, DocumentAction.SUBMIT, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update document successfully', async () => {
      const document = { Id: 1, Status: DocumentStatus.DRAFT } as any;
      const dto = { Title: 'Updated' };
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
        save: jest.fn().mockImplementation((entity, data) => Promise.resolve({ ...document, ...dto })),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      const result = await service.update(1, dto as any, 1);
      expect(result.Title).toBe('Updated');
    });

    it('should throw NotFoundException if document not found in update', async () => {
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      await expect(service.update(1, {}, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if status is not DRAFT', async () => {
      const document = { Id: 1, Status: DocumentStatus.SUBMITTED } as any;
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
      };
      dataSource.transaction.mockImplementation((cb) => cb(manager as any));

      await expect(service.update(1, {}, 1)).rejects.toThrow(BadRequestException);
    });
  });
});
