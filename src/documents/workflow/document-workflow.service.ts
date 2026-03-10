import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';
import { RolesRepository } from 'src/roles/roles.repository';
import { ROLES_SEED } from 'src/common/seeds/roles.seed';
import { WORKFLOW_RULES_SEED } from 'src/common/seeds/workflow-rules.seed';

@Injectable()
export class DocumentWorkflowService implements OnModuleInit {
    private readonly logger = new Logger(DocumentWorkflowService.name);
    constructor(
        @InjectRepository(DocumentWorkflowRule)
        private readonly workflowRepository: Repository<DocumentWorkflowRule>,
        private readonly roleRepository: RolesRepository,
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing DocumentWorkflowService...');
        try {
            await this.seedRoles();
            await this.seedWorkflowRules();
        } catch (error) {
            this.logger.error('Error during seeding:', error.message, error.stack);
        }
    }

    private async seedRoles() {
        for (const roleData of ROLES_SEED) {
            const existing = await this.roleRepository.findByCode(roleData.Code);
            if (!existing) {
                await this.roleRepository.createRole(roleData);
            }
        }
        this.logger.log('Seeded Roles');
    }

    private async seedWorkflowRules() {
        this.logger.log('Seeding workflow rules...');
        if (await this.workflowRepository.count() > 0) {
            this.logger.log('Workflow rules already exist');
            return;
        }
        await this.workflowRepository.query('DELETE FROM DocumentWorkflowRules');

        for (const rule of WORKFLOW_RULES_SEED) {
            await this.workflowRepository.query(
                'INSERT INTO DocumentWorkflowRules (CurrentStatus, Action, NextStatus, RoleCode) VALUES (@0, @1, @2, @3)',
                [rule.CurrentStatus, rule.Action, rule.NextStatus, rule.RoleCode]
            );
        }

        this.logger.log('Seeded Document Workflow Rules');
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
