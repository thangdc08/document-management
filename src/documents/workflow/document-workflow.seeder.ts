import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentWorkflowRule } from '../entities/document-workflow-rule.entity';
import { RolesRepository } from 'src/roles/roles.repository';
import { ROLES_SEED } from 'src/common/seeds/roles.seed';
import { WORKFLOW_RULES_SEED } from 'src/common/seeds/workflow-rules.seed';
import { PERMISSIONS_SEED, ROLE_PERMISSIONS_MAP } from 'src/common/seeds/permissions.seed';

@Injectable()
export class DocumentWorkflowSeeder {
    private readonly logger = new Logger(DocumentWorkflowSeeder.name);

    constructor(
        @InjectRepository(DocumentWorkflowRule)
        private readonly workflowRepository: Repository<DocumentWorkflowRule>,
        private readonly roleRepository: RolesRepository,
    ) { }

    async seed() {
        this.logger.log('Running document workflow seeders...');
        await this.seedRoles();
        await this.seedWorkflowRules();
        await this.seedPermissions();
        await this.seedRolePermissions();
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
        
        for (const rule of WORKFLOW_RULES_SEED) {
            const existing = await this.workflowRepository.findOne({
                where: { 
                    CurrentStatus: rule.CurrentStatus as any, 
                    Action: rule.Action as any, 
                    RoleCode: rule.RoleCode 
                }
            });

            if (!existing) {
                await this.workflowRepository.query(
                    'INSERT INTO DocumentWorkflowRules (CurrentStatus, Action, NextStatus, RoleCode) VALUES (@0, @1, @2, @3)',
                    [rule.CurrentStatus, rule.Action, rule.NextStatus, rule.RoleCode]
                );
            }
        }

        this.logger.log('Seeded Document Workflow Rules');
    }

    private async seedPermissions() {
        this.logger.log('Seeding permissions...');

        for (const p of PERMISSIONS_SEED) {
            const existing = await this.workflowRepository.query(
                'SELECT Id FROM Permissions WHERE Code = @0', 
                [p.Code]
            );

            if (existing.length === 0) {
                await this.workflowRepository.query(
                    'INSERT INTO Permissions (Code, Name, CreatedAt) VALUES (@0, @1, GETDATE())',
                    [p.Code, p.Name]
                );
            }
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
                    const existing = await this.workflowRepository.query(
                        'SELECT Id FROM RolePermissions WHERE RoleId = @0 AND PermissionId = @1',
                        [roleId, permId]
                    );

                    if (existing.length === 0) {
                        await this.workflowRepository.query(
                            'INSERT INTO RolePermissions (RoleId, PermissionId, IsEnabled, CreatedAt) VALUES (@0, @1, 1, GETDATE())',
                            [roleId, permId]
                        );
                    }
                }
            }
        }

        this.logger.log('Seeded Role-Permissions');
    }
}
