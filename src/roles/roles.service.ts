import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

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
}
