import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async findByCode(code: string): Promise<Permission | null> {
    return await this.repository.findOne({ where: { Code: code } });
  }

  async findById(id: number): Promise<Permission | null> {
    return await this.repository.findOne({ where: { Id: id } });
  }

  async findAllPermissions(): Promise<Permission[]> {
    return await this.repository.find({
      order: { CreatedAt: 'DESC' },
    });
  }

  async createPermission(dto: CreatePermissionDto): Promise<Permission> {
    const permission = this.repository.create(dto);
    return await this.repository.save(permission);
  }

  async updatePermission(
    id: number,
    dto: UpdatePermissionDto,
  ): Promise<Permission | null> {
    await this.repository.update({ Id: id }, dto);
    return await this.findById(id);
  }

  async deletePermission(id: number): Promise<void> {
    await this.repository.delete({ Id: id });
  }

  async findListPermission(filter: { id: number[] }): Promise<Permission[]> {
    return this.repository.findBy({
      Id: In(filter.id),
    });
  }

  async findOneByPermissionCode(code: string): Promise<Permission | null> {
    return await this.repository.findOne({ where: { Code: code } });
  }
}

