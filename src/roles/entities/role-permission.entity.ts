import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "src/permissions/entities/permission.entity";

@Entity('RolePermissions')
@Index('IX_RolePermissions_RoleId_PermissionId', ['RoleId', 'PermissionId'], { unique: true })
@Index('IX_RolePermissions_RoleId', ['RoleId'])
export class RolePermission {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  RoleId: number;

  @Column()
  PermissionId: number;

  @Column({ default: true })
  IsEnabled: boolean;

  @Column({ type: 'datetime2' })
  CreatedAt: Date;

  // Thiết lập mối quan hệ Many-to-One với bảng Roles
  @ManyToOne(() => Role, (role) => role.Id)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  // Thiết lập mối quan hệ Many-to-One với bảng Permissions
  @ManyToOne(() => Permission, (permission) => permission.Id)
  @JoinColumn({ name: 'PermissionId' })
  permission: Permission;
}