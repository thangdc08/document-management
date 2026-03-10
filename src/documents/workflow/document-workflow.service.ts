import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';
import { RolesRepository } from 'src/roles/roles.repository';

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
        const roles = [
            { Code: 'ADMIN', Name: 'Quản trị viên' },
            { Code: 'VAN_THU', Name: 'Văn thư' },
            { Code: 'GIAM_DOC', Name: 'Giám đốc' },
            { Code: 'TRUONG_PHONG', Name: 'Trưởng phòng' },
            { Code: 'CAN_BO', Name: 'Cán bộ' },
        ];

        for (const roleData of roles) {
            const existing = await this.roleRepository.findByCode(roleData.Code);
            if (!existing) {
                await this.roleRepository.createRole(roleData);
            }
        }
        console.log('Seeded Roles');
    }

    private async seedWorkflowRules() {
        this.logger.log('Seeding workflow rules...');

        // Use raw query for robustness in clearing and inserting
        await this.workflowRepository.query('DELETE FROM DocumentWorkflowRules');
        this.logger.log('Existing workflow rules cleared');

        const rules = [
            // (Bắt đầu) -> Văn thư tạo văn bản -> DRAFT
            // DRAFT
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.SUBMIT, NextStatus: DocumentStatus.SUBMITTED, RoleCode: 'VAN_THU' },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'ADMIN' },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.DELETE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },
            { CurrentStatus: DocumentStatus.DRAFT, Action: DocumentAction.DELETE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'ADMIN' },

            // SUBMITTED
            { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.REJECT, NextStatus: DocumentStatus.REJECTED, RoleCode: 'GIAM_DOC' },
            { CurrentStatus: DocumentStatus.SUBMITTED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED, RoleCode: 'GIAM_DOC' },

            // REJECTED
            { CurrentStatus: DocumentStatus.REJECTED, Action: DocumentAction.UPDATE, NextStatus: DocumentStatus.DRAFT, RoleCode: 'VAN_THU' },

            // ASSIGNED
            { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.ASSIGN, NextStatus: DocumentStatus.ASSIGNED, RoleCode: 'TRUONG_PHONG' },
            { CurrentStatus: DocumentStatus.ASSIGNED, Action: DocumentAction.START_PROCESS, NextStatus: DocumentStatus.IN_PROCESS, RoleCode: 'CAN_BO' },

            // IN_PROCESS
            { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.COMPLETE, NextStatus: DocumentStatus.APPROVED, RoleCode: 'CAN_BO' },
            { CurrentStatus: DocumentStatus.IN_PROCESS, Action: DocumentAction.FAIL, NextStatus: DocumentStatus.FAILED, RoleCode: 'CAN_BO' },

            // APPROVED
            { CurrentStatus: DocumentStatus.APPROVED, Action: DocumentAction.APPROVE, NextStatus: DocumentStatus.COMPLETED, RoleCode: 'GIAM_DOC' },

            // FAILED / COMPLETED
            { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'GIAM_DOC' },
            { CurrentStatus: DocumentStatus.FAILED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'ADMIN' },
            { CurrentStatus: DocumentStatus.COMPLETED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'GIAM_DOC' },
            { CurrentStatus: DocumentStatus.COMPLETED, Action: DocumentAction.CLOSE, NextStatus: DocumentStatus.CLOSED, RoleCode: 'ADMIN' },
        ];

        for (const rule of rules) {
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
