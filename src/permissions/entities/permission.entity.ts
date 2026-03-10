import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany
} from 'typeorm';
import { RolePermission } from 'src/roles/entities/role-permission.entity';

@Entity('Permissions')
@Index('IX_Permissions_Code', ['Code'], { unique: true })
export class Permission {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Code: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  Name: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  Description: string;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;

  // Thiết lập quan hệ 1-nhiều với bảng trung gian RolePermissions
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];
}