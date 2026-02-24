import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn
} from 'typeorm';

@Entity('Permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Code: string;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;

  // Thiết lập quan hệ 1-nhiều với bảng trung gian RolePermissions
  // @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  // rolePermissions: RolePermission[];
}