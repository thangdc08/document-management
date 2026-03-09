import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';

@Injectable()
export class DocumentWorkflowService implements OnModuleInit {
    constructor(
        @InjectRepository(DocumentWorkflowRule)
        private readonly workflowRepository: Repository<DocumentWorkflowRule>,
    ) { }

    async onModuleInit() {
        await this.seedWorkflowRules();
    }

    private async seedWorkflowRules() {
        const count = await this.workflowRepository.count();
        if (count > 0) return;

        const rules: Partial<DocumentWorkflowRule>[] = [
            // DRAFT
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.SUBMIT, NextStatus: DocumentStatus.SUBMITTED },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.DELETE, NextStatus: DocumentStatus.DRAFT },

            // SUBMITTED
            { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED },
            { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.REJECT, NextStatus: DocumentStatus.REJECTED },
            { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED },

            // ASSIGNED
            { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.START_PROCESS, NextStatus: DocumentStatus.IN_PROCESS },
            { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.REJECT, NextStatus: DocumentStatus.REJECTED },

            // IN_PROCESS
            { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.APPROVE, NextStatus: DocumentStatus.APPROVED },
            { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.FAIL, NextStatus: DocumentStatus.FAILED },

            // APPROVED
            { CurrentStatus: DocumentStatus.APPROVED, Action: DocumentAction.COMPLETE, NextStatus: DocumentStatus.COMPLETED },
            { CurrentStatus: DocumentStatus.APPROVED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED },

            // COMPLETED
            { CurrentStatus: DocumentStatus.COMPLETED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED },

            // FAILED
            { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED },
            { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED },

            // REJECTED
            { CurrentStatus: DocumentStatus.REJECTED, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.REJECTED },
            { CurrentStatus: DocumentStatus.REJECTED, Action: DocumentAction.SUBMIT, NextStatus: DocumentStatus.SUBMITTED },
            { CurrentStatus: DocumentStatus.REJECTED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED },
        ];

        await this.workflowRepository.save(rules);
        console.log('Seeded Document Workflow Rules');
    }

    async validateTransition(current: DocumentStatus, action: DocumentAction): Promise<DocumentWorkflowRule> {
        const rule = await this.workflowRepository.findOne({
            where: { CurrentStatus: current, Action: action },
        });

        if (!rule) {
            throw new BadRequestException(`Cannot perform action ${action} when document is in status ${current}`);
        }

        return rule;
    }

    async getNextStatus(current: DocumentStatus, action: DocumentAction): Promise<DocumentStatus> {
        if (action === DocumentAction.CREATE) {
            return DocumentStatus.DRAFT;
        }

        const rule = await this.validateTransition(current, action);
        return rule.NextStatus;
    }

    async getAllowedActions(current: DocumentStatus): Promise<DocumentAction[]> {
        const rules = await this.workflowRepository.find({
            where: { CurrentStatus: current },
        });
        return rules.map((r) => r.Action);
    }
}
