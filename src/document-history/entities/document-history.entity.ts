import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';
import { DocumentAction } from 'src/documents/enums/document-action.enum';
import { DocumentStatus } from 'src/documents/enums/document-status.enum';

@Entity('DocumentHistories')
export class DocumentHistory {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  DocumentId: number;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'DocumentId' })
  Document: Document;

  @Column({ type: 'nvarchar', nullable: true })
  Note: string;

  @Column({
    type: 'nvarchar',
    enum: DocumentAction,
  })
  Action: DocumentAction;

  @Column({
    type: 'nvarchar',
    enum: DocumentStatus,
  })
  StatusAfter: DocumentStatus;

  @Column({ nullable: true })
  FromUserId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'FromUserId' })
  FromUser: User;

  @Column({ nullable: true })
  ToUserId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'ToUserId' })
  ToUser: User;

  @CreateDateColumn()
  CreatedAt: Date;
}
