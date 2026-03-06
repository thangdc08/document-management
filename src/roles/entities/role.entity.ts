import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('Roles')
@Index('IX_Roles_Code', ['Code'], { unique: true })
@Index('IX_Roles_IsActive', ['IsActive'])
export class Role {

  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  Code: string;

  @Column({ type: 'nvarchar', length: 150 })
  Name: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  Description: string;

  @Column({ type: 'bit', default: true })
  IsActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;

  // Quan hệ 1 Role - nhiều User
  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => RolePermission, rp => rp.role)
  rolePermissions: RolePermission[];
}