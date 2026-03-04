import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { PermissionsRepository } from 'src/permissions/permissions.repository';
import { DataSource } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RolePermission } from './entities/role-permission.entity';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: jest.Mocked<RolesRepository>;
  let permissionsRepository: jest.Mocked<PermissionsRepository>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RolesRepository,
          useValue: {
            findByCode: jest.fn(),
            createRole: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateRole: jest.fn(),
            deleteRole: jest.fn(),
            softDeleteRole: jest.fn(),
            findRolePermissions: jest.fn(),
            findRoleWithPermissions: jest.fn(),
          },
        },
        {
          provide: PermissionsRepository,
          useValue: {
            findListPermission: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesRepository = module.get(RolesRepository);
    permissionsRepository = module.get(PermissionsRepository);
    dataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= CREATE =================

  describe('create', () => {
    it('should throw ConflictException if code exists', async () => {
      rolesRepository.findByCode.mockResolvedValue({ Id: 1 } as any);

      await expect(
        service.create({ Code: 'ADMIN' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create role if code not exists', async () => {
      rolesRepository.findByCode.mockResolvedValue(null);
      rolesRepository.createRole.mockResolvedValue({ Id: 1 } as any);

      const result = await service.create({ Code: 'ADMIN' } as any);

      expect(result).toEqual({ Id: 1 });
      expect(rolesRepository.createRole).toHaveBeenCalled();
    });
  });

  // ================= FIND ONE =================

  describe('findOne', () => {
    it('should throw NotFoundException if role not found', async () => {
      rolesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return role if found', async () => {
      rolesRepository.findById.mockResolvedValue({ Id: 1 } as any);

      const result = await service.findOne(1);

      expect(result).toEqual({ Id: 1 });
    });
  });

  // ================= FIND ALL =================
  describe('findAll', () => {
    it('should return list of roles', async () => {
      rolesRepository.findAll.mockResolvedValue([{ Id: 1 }] as any);

      const result = await service.findAll();

      expect(result).toEqual([{ Id: 1 }]);
    });
  });

  // SOFT DELETE

  describe('softDelete', () => {
    it('should throw NotFoundException if role not found', async () => {
      rolesRepository.softDeleteRole.mockResolvedValue(null);

      await expect(service.softDelete(1)).rejects.toThrow(NotFoundException);
    });

    it('should soft delete role', async () => {
      rolesRepository.softDeleteRole.mockResolvedValue({ Id: 1 } as any);

      const result = await service.softDelete(1);

      expect(result).toEqual({ message: 'Role deactivated successfully' });
    });
  });

  // ================= UPDATE =================

  describe('update', () => {
    it('should throw NotFoundException if role not found', async () => {
      rolesRepository.updateRole.mockResolvedValue(null);

      await expect(
        service.update(1, { Name: 'New' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update role', async () => {
      rolesRepository.updateRole.mockResolvedValue({ Id: 1 } as any);

      const result = await service.update(1, { Name: 'New' } as any);

      expect(result).toEqual({ Id: 1 });
    });
  });

  // ================= REMOVE =================

  describe('remove', () => {
    it('should throw NotFoundException if role not found', async () => {
      rolesRepository.findById.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete role', async () => {
      rolesRepository.findById.mockResolvedValue({ Id: 1 } as any);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Role deleted successfully'});
      expect(rolesRepository.deleteRole).toHaveBeenCalledWith(1);
    });
  });

  // ================= ASSIGN PERMISSIONS =================

  describe('assignPermissions', () => {
    it('should throw NotFoundException if role not exists', async () => {
      rolesRepository.findById.mockResolvedValue(null);

      await expect(
        service.assignPermissions(1, [1, 2]),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if some permission not exists', async () => {
      rolesRepository.findById.mockResolvedValue({ Id: 1 } as any);
      rolesRepository.findRolePermissions.mockResolvedValue([]);
      permissionsRepository.findListPermission.mockResolvedValue([{ Id: 1 }] as any);

      await expect(
        service.assignPermissions(1, [1, 2]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should assign permissions correctly', async () => {
      rolesRepository.findById.mockResolvedValue({ Id: 1 } as any);

      rolesRepository.findRolePermissions.mockResolvedValue([
        { PermissionId: 1 } as RolePermission,
      ]);

      permissionsRepository.findListPermission.mockResolvedValue([
        { Id: 1 },
        { Id: 2 },
      ] as any);

      rolesRepository.findRoleWithPermissions.mockResolvedValue({
        Id: 1,
        permissions: [{ Id: 1 }, { Id: 2 }],
      } as any);

      // mock transaction
      dataSource.transaction.mockImplementation(async (cb: any) => {
        const manager = {
          delete: jest.fn(),
          save: jest.fn(),
        };
        return cb(manager);
      });

      const result = await service.assignPermissions(1, [1, 2]);

      expect(result.permissions.length).toBe(2);
      expect(dataSource.transaction).toHaveBeenCalled();
    });
  });
});