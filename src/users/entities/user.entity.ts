import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('Users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'nvarchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'nvarchar', length: 150 })
  fullName: string;

  @Column({ type: 'nvarchar', length: 150, nullable: true })
  email: string;

  @Column()
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}