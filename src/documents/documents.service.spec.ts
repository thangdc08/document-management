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
import { DocumentWorkflowService } from './workflow/document-workflow.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentFile } from './entities/document-file.entity';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let documentRepository: jest.Mocked<DocumentRepository>;
  let usersRepository: jest.Mocked<UsersRepository>;
  let dataSource: jest.Mocked<DataSource>;
  let workflowService: jest.Mocked<DocumentWorkflowService>;

  beforeEach(async () => {
    const mockDocumentRepository = {
      findHistory: jest.fn(),
      findOneByDocumentCode: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findAllWithUsers: jest.fn(),
      findOneWithUsers: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
    };

    const mockUsersRepository = {
      findOne: jest.fn(),
    };

    const mockDataSource = {
      transaction: jest.fn(),
    };

    const mockWorkflowService = {
      getNextStatus: jest.fn(),
      getAllowedActions: jest.fn(),
      validateTransition: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: DocumentRepository, useValue: mockDocumentRepository },
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: DataSource, useValue: mockDataSource },
        { provide: DocumentWorkflowService, useValue: mockWorkflowService },
        {
          provide: getRepositoryToken(DocumentFile),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentRepository = module.get(DocumentRepository);
    usersRepository = module.get(UsersRepository);
    dataSource = module.get(DataSource);
    workflowService = module.get(DocumentWorkflowService);
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
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockReturnValue({ ...createDto, Id: 1 }),
        save: jest.fn().mockResolvedValue({ ...createDto, Id: 1 }),
      };
      dataSource.transaction.mockImplementation((...args: any[]) => {
        const callback = typeof args[0] === 'function' ? args[0] : args[1];
        return callback(manager as any);
      });
      usersRepository.findOne.mockResolvedValue({ Id: 1 } as any);

      const result = await service.create(createDto as any);
      expect(result.Id).toBe(1);
    });

    it('should throw ConflictException if DocumentCode exists', async () => {
      const manager = {
        findOne: jest.fn().mockResolvedValue({ Id: 1 }),
      };
      dataSource.transaction.mockImplementation((...args: any[]) => {
        const callback = typeof args[0] === 'function' ? args[0] : args[1];
        return callback(manager as any);
      });

      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated documents', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const data = [{ id: 1 }] as any;
      documentRepository.findAll.mockResolvedValue({ data, total: 1 });

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

  describe('changeStatus', () => {
    it('should change status successfully', async () => {
      const user = { Id: 1, role: { Code: 'CAN_BO' } };
      const document = { Id: 1, Status: DocumentStatus.IN_PROCESS } as any;
      const manager = {
        findOne: jest.fn().mockResolvedValue(document),
        save: jest.fn().mockResolvedValue(document),
      };
      dataSource.transaction.mockImplementation((...args: any[]) => {
        const callback = typeof args[0] === 'function' ? args[0] : args[1];
        return callback(manager);
      });
      usersRepository.findOne.mockResolvedValue(user as any);
      workflowService.getNextStatus.mockResolvedValue(DocumentStatus.APPROVED);

      const result = await service.changeStatus(1, DocumentAction.COMPLETE, 1);
      expect(result.Status).toBe(DocumentStatus.APPROVED);
    });

    it('should throw NotFoundException if user not found', async () => {
      dataSource.transaction.mockImplementation((...args: any[]) => {
        const callback = typeof args[0] === 'function' ? args[0] : args[1];
        return callback({} as any);
      });
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.changeStatus(1, DocumentAction.SUBMIT, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllowedActions', () => {
    it('should return allowed actions for user role', async () => {
      const user = { Id: 1, role: { Code: 'VAN_THU' } };
      usersRepository.findOne.mockResolvedValue(user as any);
      workflowService.getAllowedActions.mockResolvedValue([DocumentAction.SUBMIT]);

      const result = await service.getAllowedActions(DocumentStatus.DRAFT, 1);
      expect(result).toEqual([DocumentAction.SUBMIT]);
      expect(workflowService.getAllowedActions).toHaveBeenCalledWith(DocumentStatus.DRAFT, 'VAN_THU');
    });
  });
});
