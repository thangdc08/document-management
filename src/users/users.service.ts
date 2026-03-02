import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { Username, Email, PasswordHash, RoleId, ...otherInfo } = createUserDto;

    if (RoleId) {
      const existingRole = await this.usersRepository.findOneByRoleId(RoleId);
      if (!existingRole) {
        throw new ConflictException('Vai trò không tồn tại');
      }
    }

    const existingUser = await this.usersRepository.findOneByUsername(Username);
    if (existingUser) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    if (Email) {
      const existingEmail = await this.usersRepository.findOneByEmail(Email);
      if (existingEmail) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    //Mã hóa mật khẩu trước khi lưu vào DB
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10;
    const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);

    const newUser = {
      ...otherInfo,
      Username,
      Email,
      PasswordHash: hashedPassword,
      RoleId,
    };

    const user = UserMapper.toResponse(await this.usersRepository.create(newUser));
    return user;
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users.map(user => UserMapper.toResponse(user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if(updateUserDto.RoleId) {
      const existingRole = await this.usersRepository.findOneByRoleId(updateUserDto.RoleId);
      if (!existingRole) {
        throw new ConflictException('Vai trò không tồn tại');
      }
    }

    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if(updateUserDto.Email) {
      const existingEmail = await this.usersRepository.findOneByEmail(updateUserDto.Email);
      if (existingEmail && existingEmail.Id !== id) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    if(updateUserDto.PasswordHash) {
      const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10;
      updateUserDto.PasswordHash = await bcrypt.hash(updateUserDto.PasswordHash, saltRounds);
    }

    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    return await this.usersRepository.remove(id);

  }
}
