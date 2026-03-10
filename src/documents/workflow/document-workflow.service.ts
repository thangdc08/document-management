import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentAction } from '../enums/document-action.enum';
import { RolesRepository } from 'src/roles/roles.repository';
import { ROLES_SEED } from 'src/common/seeds/roles.seed';
import { WORKFLOW_RULES_SEED } from 'src/common/seeds/workflow-rules.seed';
import { PERMISSIONS_SEED, ROLE_PERMISSIONS_MAP } from 'src/common/seeds/permissions.seed';

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
            await this.seedPermissions();
            await this.seedRolePermissions();
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

    private async seedPermissions() {
        this.logger.log('Seeding permissions...');
        await this.workflowRepository.query('DELETE FROM RolePermissions');
        await this.workflowRepository.query('DELETE FROM Permissions');

        for (const p of PERMISSIONS_SEED) {
            await this.workflowRepository.query(
                'INSERT INTO Permissions (Code, Name, CreatedAt) VALUES (@0, @1, GETDATE())',
                [p.Code, p.Name]
            );
        }
        this.logger.log('Seeded Permissions');
    }

    private async seedRolePermissions() {
        this.logger.log('Seeding Role-Permissions...');

        const getRole = async (code: string) => {
            const r = await this.workflowRepository.query('SELECT Id FROM Roles WHERE Code = @0', [code]);
            return r[0]?.Id;
        };

        const getPerm = async (code: string) => {
            const p = await this.workflowRepository.query('SELECT Id FROM Permissions WHERE Code = @0', [code]);
            return p[0]?.Id;
        };

        for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSIONS_MAP) as [string, string[]][]) {
            const roleId = await getRole(roleCode);
            if (!roleId) continue;

            for (const permCode of permCodes) {
                const permId = await getPerm(permCode);
                if (permId) {
                    await this.workflowRepository.query(
                        'INSERT INTO RolePermissions (RoleId, PermissionId, IsEnabled, CreatedAt) VALUES (@0, @1, 1, GETDATE())',
                        [roleId, permId]
                    );
                }
            }
        }

        this.logger.log('Seeded Role-Permissions');
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
