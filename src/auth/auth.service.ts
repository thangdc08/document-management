import { ConflictException, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { comparePasswordHelper } from './helpers/util';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { RolePermission } from 'src/roles/entities/role-permission.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>
  ) { }

  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findOneByUserName(createAuthDto.username);
    this.logger.log(`user login: ${JSON.stringify(user)}`);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await comparePasswordHelper(createAuthDto.password, user.PasswordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.Id, username: user.Username, role: user.RoleId };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const userWithPass = await this.userService.findOneByUserName(user.Username);
    if (!userWithPass) {
      throw new NotFoundException('User data not found');
    }
    
    const isPasswordValid = await comparePasswordHelper(oldPassword, userWithPass.PasswordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    return await this.userService.update(userId, { PasswordHash: newPassword } as any);
  }


  async hasPermission(
    roleId: number,
    permissionCode: string,
  ): Promise<boolean> {

    const rolePermissions = await this.rolePermissionRepository.find({
      where: {
        RoleId: roleId,
        IsEnabled: true,
      },
      relations: ['permission'],
    });

    const permissionCodes = rolePermissions.map(
      (item) => item.permission.Code,
    );

    // ADMIN_ALL bypass
    if (permissionCodes.includes('ADMIN_ALL')) {
      return true;
    }

    return permissionCodes.includes(permissionCode);
  }

}
