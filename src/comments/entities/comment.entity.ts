import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';

@Entity('Comments')
@Index('IX_Comments_DocumentId', ['DocumentId'])
@Index('IX_Comments_UserId', ['UserId'])
export class Comment {

  @PrimaryGeneratedColumn({ name: 'Id' })
  Id: number;

  @Column({ type: 'nvarchar', length: 1000 })
  Content: string;

  @Column({ name: 'DocumentId' })
  DocumentId: number;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'DocumentId' })
  Document: Document;

  @Column({ name: 'UserId', nullable: true })
  UserId: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'UserId' })
  User: User;

  @CreateDateColumn({ name: 'CreatedAt' })
  CreatedAt: Date;
}