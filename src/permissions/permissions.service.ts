import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { Code } = createPermissionDto;

    const existingPermission =
      await this.permissionsRepository.findByCode(Code);

    if (existingPermission) {
      throw new ConflictException(
        'Permission with this code already exists',
      );
    }

    return await this.permissionsRepository.createPermission(
      createPermissionDto,
    );
  }

  async findAll() {
    return await this.permissionsRepository.findAllPermissions();
  }

  async findOne(id: number) {
    const permission =
      await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission =
      await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionsRepository.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  async remove(id: number) {
    const permission =
      await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionsRepository.deletePermission(id);

    return { message: 'Permission deleted successfully' };
  }
}