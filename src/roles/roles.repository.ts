import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async findByCode(code: string): Promise<Role | null> {
    return await this.repository.findOne({ where: { Code: code } });
  }

  async findById(id: number): Promise<Role | null> {
    return await this.repository.findOne({ where: { Id: id } });
  }

  async findAll(): Promise<Role[]> {
    return await this.repository.find({
      where: { IsActive: true },
      order: { CreatedAt: 'DESC' },
    });
  }

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = this.repository.create(dto);
    return await this.repository.save(role);
  }

  async updateRole(id: number, dto: UpdateRoleDto): Promise<Role | null> {
    const role = await this.findById(id);
    if (!role) return null;

    Object.assign(role, dto); // sao chép các thuộc tính từ DTO vào entity

    return await this.repository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    await this.repository.delete({ Id: id });
  }

  async softDeleteRole(id: number): Promise<Role | null> {
    const role = await this.findById(id);

    if (!role) return null;

    role.IsActive = false;

    return await this.repository.save(role);
  }

  async findRolePermissions(roleId: number): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      where: { RoleId: roleId },
    });
  }

  async findRoleWithPermissions(id: number) {
    const role = await this.repository.findOne({
      where: { Id: id },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });

    if (!role) return null;

    return {
      Id: role.Id,
      Code: role.Code,
      Name: role.Name,
      Description: role.Description,
      IsActive: role.IsActive,
      permissions: role.rolePermissions.map((rp) => rp.permission),
    };
  }
}
