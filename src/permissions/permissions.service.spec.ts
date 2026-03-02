import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: jest.Mocked<PermissionsRepository>;

  const mockPermission = {
    Id: 1,
    Code: 'USER_VIEW',
    Name: 'View User',
    Description: 'Permission to view user',
    CreatedAt: new Date(),
  };

  const mockRepository = {
    findByCode: jest.fn(),
    findById: jest.fn(),
    findAllPermissions: jest.fn(),
    createPermission: jest.fn(),
    updatePermission: jest.fn(),
    deletePermission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PermissionsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    repository = module.get(PermissionsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    // Test cho case: tạo permission thành công
    it('should create permission successfully', async () => {
      repository.findByCode.mockResolvedValue(null);
      repository.createPermission.mockResolvedValue(mockPermission as any);

      const result = await service.create({
        Code: 'USER_VIEW',
        Name: 'View User',
        Description: 'Permission to view user',
      });

      expect(repository.findByCode).toHaveBeenCalledWith('USER_VIEW');
      expect(repository.createPermission).toHaveBeenCalled();
      expect(result).toEqual(mockPermission);
    });

    // Test cho case: tạo permission thất bại do code đã tồn tại
    it('should throw ConflictException if code exists', async () => {
      repository.findByCode.mockResolvedValue(mockPermission as any);

      await expect(
        service.create({
          Code: 'USER_VIEW',
          Name: 'View User',
          Description: 'Permission to view user',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    // Test cho case: trả về danh sách permissions thành công
    it('should return list of permissions', async () => {
      repository.findAllPermissions.mockResolvedValue([mockPermission] as any);

      const result = await service.findAll();

      expect(repository.findAllPermissions).toHaveBeenCalled();
      expect(result).toEqual([mockPermission]);
    });
  });

  describe('findOne', () => {
    // Test cho case: trả về permission nếu tìm thấy
    it('should return permission if found', async () => {
      repository.findById.mockResolvedValue(mockPermission as any);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPermission);
    });
    // Test cho case: trả về lỗi nếu không tìm thấy permission
    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    // Test cho case: cập nhật permission thành công
    it('should update permission successfully', async () => {
      repository.findById.mockResolvedValue(mockPermission as any);
      repository.updatePermission.mockResolvedValue({
        ...mockPermission,
        Name: 'Updated Name',
      } as any);

      const result = await service.update(1, {
        Name: 'Updated Name',
      });

      expect(repository.updatePermission).toHaveBeenCalledWith(1, {
        Name: 'Updated Name',
      });

      expect(result!.Name).toBe('Updated Name');
    });
    // Test cho case: cập nhật permission thất bại do không tìm thấy permission
    it('should throw NotFoundException if permission not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(1, { Name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    // Test cho case: xóa permission thành công
    it('should delete permission successfully', async () => {
      repository.findById.mockResolvedValue(mockPermission as any);
      repository.deletePermission.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(repository.deletePermission).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Permission deleted successfully',
      });
    });
    // Test cho case: xóa permission thất bại do không tìm thấy permission
    it('should throw NotFoundException if permission not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});