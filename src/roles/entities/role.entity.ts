import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('Roles')
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'nvarchar', length: 150 })
  name: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'bit', default: true }) 
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  // Quan hệ 1 Role - nhiều User
  @OneToMany(() => User, user => user.role)
  users: User[];
}