import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermission } from './entities/role-permission.entity';
import { DataSource, In } from 'typeorm';
import { PermissionsRepository } from 'src/permissions/permissions.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionRepository: PermissionsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.rolesRepository.findByCode(dto.Code);

    if (existing) {
      throw new ConflictException('Role code already exists');
    }

    return await this.rolesRepository.createRole(dto);
  }

  async findAll() {
    return await this.rolesRepository.findAll();
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const updated = await this.rolesRepository.updateRole(id, dto);

    if (!updated) {
      throw new NotFoundException('Role not found');
    }

    return updated;
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.rolesRepository.deleteRole(id);

    return { message: 'Role deleted successfully' };
  }

  async softDelete(id: number) {
    const role = await this.rolesRepository.softDeleteRole(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return {
      message: 'Role deactivated successfully',
    };
  }

  async assignPermissions(roleId: number, newPermissionIds: number[]) {
    const existingRole = await this.rolesRepository.findById(roleId);

    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }
    const currentPermissions =
      await this.rolesRepository.findRolePermissions(roleId);

    const permissions = await this.permissionRepository.findListPermission({
      id: newPermissionIds,
    });

    if (permissions.length !== newPermissionIds.length) {
      throw new BadRequestException('Some permissions do not exist');
    }

    const currentIds = currentPermissions.map((p) => p.PermissionId);

    //Lọc id có trong cũ nhưng ko có trong mới => cần xóa
    const idsToDelete = currentIds.filter(
      (id) => !newPermissionIds.includes(id),
    );

    //Lọc id có trong mới nhưng ko có trong cũ => cần thêm
    const idsToAdd = newPermissionIds.filter((id) => !currentIds.includes(id));

    // Thực thi trong 1 Transaction tránh lỗi nửa chừng
    await this.dataSource.transaction(async (manager) => {
      if (idsToDelete.length > 0) {
        await manager.delete(RolePermission, {
          RoleId: roleId,
          PermissionId: In(idsToDelete),
        });
      }
      if (idsToAdd.length > 0) {
        const newRows = idsToAdd.map((pId) => ({
          RoleId: roleId,
          PermissionId: pId,
        }));
        await manager.save(RolePermission, newRows);
      }
    });

    const role = await this.rolesRepository.findRoleWithPermissions(roleId);

    return role;
  }
}
