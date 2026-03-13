import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolePermission } from 'src/roles/entities/role-permission.entity';
import { ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as util from './helpers/util';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let rolePermissionRepository: any;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByUserName: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };
    const mockRolePermissionRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(RolePermission), useValue: mockRolePermissionRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
    jwtService = module.get(JwtService);
    rolePermissionRepository = module.get(getRepositoryToken(RolePermission));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const dto = { username: 'testuser', password: 'password123' };
    const user = { Id: 1, Username: 'testuser', PasswordHash: 'hashed', RoleId: 1 };

    it('should sign in successfully and return a token', async () => {
      userService.findOneByUserName.mockResolvedValue(user as any);
      jest.spyOn(util, 'comparePasswordHelper').mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('token');

      const result = await service.signIn(dto);
      expect(result).toEqual({ access_token: 'token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.Id, username: user.Username, role: user.RoleId });
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOneByUserName.mockResolvedValue(null);
      await expect(service.signIn(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      userService.findOneByUserName.mockResolvedValue(user as any);
      jest.spyOn(util, 'comparePasswordHelper').mockResolvedValue(false);
      await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should call userService.create', async () => {
      const dto = { username: 'new' } as any;
      await service.register(dto);
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { Id: 1 };
      userService.findOne.mockResolvedValue(user as any);
      const result = await service.getProfile(1);
      expect(result).toBe(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);
      await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    const userId = 1;
    const user = { Id: userId, Username: 'test' };
    const userWithPass = { Id: userId, Username: 'test', PasswordHash: 'oldHash' };

    it('should change password successfully', async () => {
      userService.findOne.mockResolvedValue(user as any);
      userService.findOneByUserName.mockResolvedValue(userWithPass as any);
      jest.spyOn(util, 'comparePasswordHelper').mockResolvedValue(true);

      await service.changePassword(userId, 'old', 'new');
      expect(userService.update).toHaveBeenCalledWith(userId, { PasswordHash: 'new' });
    });

    it('should throw BadRequestException if old password incorrect', async () => {
      userService.findOne.mockResolvedValue(user as any);
      userService.findOneByUserName.mockResolvedValue(userWithPass as any);
      jest.spyOn(util, 'comparePasswordHelper').mockResolvedValue(false);

      await expect(service.changePassword(userId, 'wrong', 'new')).rejects.toThrow(BadRequestException);
    });
  });

  describe('hasPermission', () => {
    const roleId = 1;
    const permissions = [
      { permission: { Code: 'READ_DOC' } },
      { permission: { Code: 'WRITE_DOC' } },
    ];

    it('should return true if user has permission', async () => {
      rolePermissionRepository.find.mockResolvedValue(permissions);
      const result = await service.hasPermission(roleId, 'READ_DOC');
      expect(result).toBe(true);
    });

    it('should return false if user does not have permission', async () => {
      rolePermissionRepository.find.mockResolvedValue(permissions);
      const result = await service.hasPermission(roleId, 'DELETE_DOC');
      expect(result).toBe(false);
    });

    it('should return true if user has ADMIN_ALL', async () => {
      rolePermissionRepository.find.mockResolvedValue([{ permission: { Code: 'ADMIN_ALL' } }]);
      const result = await service.hasPermission(roleId, 'ANY_PERMISSION');
      expect(result).toBe(true);
    });
  });
});
