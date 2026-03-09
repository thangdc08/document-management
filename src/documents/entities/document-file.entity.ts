import { Document } from './document.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('DocumentFiles')
@Index('IX_DocumentFiles_DocumentId', ['DocumentId'])
export class DocumentFile {
  @PrimaryGeneratedColumn({ name: 'Id' })
  Id: number;

  @ManyToOne(() => Document, (document) => document.Files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'DocumentId' })
  Document: Document;

  @Column({ name: 'DocumentId', nullable: true })
  DocumentId: number;

  @Column({ length: 255 })
  FileName: string;

  @Column({ length: 500 })
  FilePath: string;

  @Column({ type: 'bigint' })
  FileSize: number;

  @Column({ length: 100 })
  FileType: string;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'UploadedBy' })
  UploadedByUser: User;

  @Column({ name: 'UploadedBy' })
  UploadedBy: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  CreatedAt: Date;
}