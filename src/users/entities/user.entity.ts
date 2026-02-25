import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('Users')
export class User {

  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  Username: string;

  @Column({ type: 'nvarchar', length: 255 })
  PasswordHash: string;

  @Column({ type: 'nvarchar', length: 150 })
  FullName: string;

  @Column({ type: 'nvarchar', length: 150, nullable: true })
  Email: string;

  @Column()
  RoleId: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'RoleId' })
  role: Role;

  @Column({ type: 'bit', default: true })
  IsActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;
}