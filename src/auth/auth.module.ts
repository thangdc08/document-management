import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolePermission } from 'src/roles/entities/role-permission.entity';
import { PermissionsRepository } from 'src/permissions/permissions.repository';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    PassportModule,
    PermissionsModule,
    TypeOrmModule.forFeature([RolePermission]),
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secretOrPrivateKey: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // export để PermissionGuard dùng được
})
export class AuthModule { }
