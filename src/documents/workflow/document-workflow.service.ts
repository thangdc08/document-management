import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';
import { DocumentWorkflowSeeder } from './document-workflow.seeder';

@Injectable()
export class DocumentWorkflowService implements OnModuleInit {
    private readonly logger = new Logger(DocumentWorkflowService.name);
    constructor(
        @InjectRepository(DocumentWorkflowRule)
        private readonly workflowRepository: Repository<DocumentWorkflowRule>,
        private readonly seeder: DocumentWorkflowSeeder,
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing DocumentWorkflowService...');
        try {
            await this.seeder.seed();
        } catch (error) {
            this.logger.error('Error during seeding:', error.message, error.stack);
        }
    }

    async validateTransition(current: DocumentStatus, action: DocumentAction, roleCode: string): Promise<DocumentWorkflowRule> {
        const rule = await this.workflowRepository.findOne({
            where: { CurrentStatus: current, Action: action, RoleCode: roleCode },
        });

        if (!rule) {
            throw new BadRequestException(`Role ${roleCode} cannot perform action ${action} when document is in status ${current}`);
        }

        return rule;
    }

    async getNextStatus(current: DocumentStatus, action: DocumentAction, roleCode: string): Promise<DocumentStatus> {
        if (action === DocumentAction.CREATE) {
            return DocumentStatus.DRAFT;
        }

        const rule = await this.validateTransition(current, action, roleCode);
        return rule.NextStatus;
    }

    async getAllowedActions(current: DocumentStatus, roleCode: string): Promise<DocumentAction[]> {
        const rules = await this.workflowRepository.find({
            where: { CurrentStatus: current, RoleCode: roleCode },
        });
        return rules.map((r) => r.Action);
    }
}
