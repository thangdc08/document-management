import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUsersRepository = {
    findOneByUsername: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneByRoleId: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= CREATE =================

  describe('create', () => {
    const dto = {
      Username: 'testuser',
      Email: 'test@mail.com',
      PasswordHash: '123456',
      RoleId: 1,
      FullName: 'Test User',
    };

    it('should create user successfully', async () => {
      repository.findOneByRoleId.mockResolvedValue({ Id: 1 } as any);
      repository.findOneByUsername.mockResolvedValue(null);
      repository.findOneByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repository.create.mockResolvedValue({ Id: 1, ...dto } as any);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw if role does not exist', async () => {
      repository.findOneByRoleId.mockResolvedValue(null);

      await expect(service.create(dto as any))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw if username exists', async () => {
      repository.findOneByRoleId.mockResolvedValue({ Id: 1 } as any);
      repository.findOneByUsername.mockResolvedValue({ Id: 99 } as any);

      await expect(service.create(dto as any))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw if email exists', async () => {
      repository.findOneByRoleId.mockResolvedValue({ Id: 1 } as any);
      repository.findOneByUsername.mockResolvedValue(null);
      repository.findOneByEmail.mockResolvedValue({ Id: 2 } as any);

      await expect(service.create(dto as any))
        .rejects
        .toThrow(ConflictException);
    });
  });

  // ================= FIND ALL =================

  describe('findAll', () => {
    it('should return users list', async () => {
      repository.findAll.mockResolvedValue([{ Id: 1 }] as any);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  // ================= FIND ONE =================

  describe('findOne', () => {
    it('should return user if exists', async () => {
      repository.findOne.mockResolvedValue({ Id: 1 } as any);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  // ================= UPDATE =================

  describe('update', () => {
    it('should update user successfully', async () => {
      repository.findOne.mockResolvedValue({ Id: 1 } as any);
      repository.update.mockResolvedValue({ Id: 1 } as any);

      const result = await service.update(1, { FullName: 'Updated' });

      expect(result).toBeDefined();
    });

    it('should throw if role invalid', async () => {
      repository.findOneByRoleId.mockResolvedValue(null);

      await expect(service.update(1, { RoleId: 5 } as any))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw if user not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.update(1, { FullName: 'Updated' }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw if email exists', async () => {
      repository.findOne.mockResolvedValue({ Id: 1 } as any);
      repository.findOneByEmail.mockResolvedValue({ Id: 2 } as any); 
      
      await expect(service.update(1, { Email: 'test@example.com' }))
        .rejects
        .toThrow(ConflictException);
    });

  });

  // ================= REMOVE =================

  describe('remove', () => {
    it('should remove user', async () => {
      repository.findOne.mockResolvedValue({ Id: 1 } as any);
      repository.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1))
        .rejects
        .toThrow(BadRequestException);
    });
  });

});