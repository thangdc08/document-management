import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { comparePasswordHelper } from './helpers/util';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
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

    const payload = { sub: user.Id, username: user.Username };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

}
