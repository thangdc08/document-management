import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';
import { RolePermission } from './entities/role-permission.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission]), PermissionsModule], 
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
