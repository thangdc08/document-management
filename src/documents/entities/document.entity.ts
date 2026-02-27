import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DocumentStatus } from '../enums/document-status.enum';

@Entity('Documents')
@Index('IX_Documents_DocumentCode', ['DocumentCode'], { unique: true })
@Index('IX_Documents_Status', ['Status'])
export class Document {
  @PrimaryGeneratedColumn({ name: 'Id' })
  Id: number;

  @Column({ length: 50 })
  DocumentCode: string;

  @Column({ length: 255 })
  Title: string;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  Description: string;

  @Column({ length: 255, nullable: true })
  FileName: string;

  @Column({ length: 500, nullable: true })
  FilePath: string;

  @Column({ type: 'bigint', nullable: true })
  FileSize: number;

  @Column({ length: 100, nullable: true })
  FileType: string;

  @Column({
    type: 'nvarchar',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  Status: DocumentStatus;

  @ManyToOne(() => User, (user) => user.createdDocuments, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'CreatedBy' })
  CreatedByUser: User;

  @Column({ name: 'CreatedBy' })
  CreatedBy: number;

  @ManyToOne(() => User, (user) => user.assignedDocuments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'AssignedTo' })
  AssignedToUser: User;

  @Column({ name: 'AssignedTo', nullable: true })
  AssignedTo: number;

  // @OneToMany(() => DocumentHistory, (history) => history.Document)
  // Histories: DocumentHistory[];

  @CreateDateColumn({ name: 'CreatedAt' })
  CreatedAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  UpdatedAt: Date;
}
