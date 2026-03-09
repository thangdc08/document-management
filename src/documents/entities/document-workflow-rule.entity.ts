import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';

@Entity('DocumentWorkflowRules')
@Index('IX_WorkflowRules_Transition', ['CurrentStatus', 'Action'])
export class DocumentWorkflowRule {
    @PrimaryGeneratedColumn({ name: 'Id' })
    Id: number;

    @Column({
        type: 'nvarchar',
        length: 50,
        enum: DocumentStatus,
    })
    CurrentStatus: DocumentStatus;

    @Column({
        type: 'nvarchar',
        length: 50,
        enum: DocumentAction,
    })
    Action: DocumentAction;

    @Column({
        type: 'nvarchar',
        length: 50,
        enum: DocumentStatus,
    })
    NextStatus: DocumentStatus;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    Description: string;
}
