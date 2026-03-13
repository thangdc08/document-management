import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RolesRepository } from 'src/roles/roles.repository';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly roleRepository: RolesRepository,
  ) { }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Username: username },
      relations: ['role'],
      select: ['Id', 'Username', 'PasswordHash', 'FullName', 'Email', 'RoleId', 'IsActive', 'CreatedAt']
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Email: email },
      select: ['Id', 'Username', 'FullName', 'Email', 'RoleId', 'IsActive', 'CreatedAt']
    });
  }

  async findOneByRoleId(roleId: number): Promise<Role | null> {
    return await this.roleRepository.findById(roleId);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({ relations: ['role'] });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { Id: id },
      relations: ['role'],
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
