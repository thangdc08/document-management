import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773136324703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ─── 1. Roles ─────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [Roles] (
                [Id]          INT IDENTITY(1,1) PRIMARY KEY,
                [Code]        NVARCHAR(50)  NOT NULL UNIQUE,
                [Name]        NVARCHAR(150) NOT NULL,
                [Description] NVARCHAR(255) NULL,
                [IsActive]    BIT           NOT NULL DEFAULT 1,
                [CreatedAt]   DATETIME      NOT NULL DEFAULT GETDATE()
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX [IX_Roles_Code]     ON [Roles] ([Code])`);
        await queryRunner.query(`CREATE INDEX        [IX_Roles_IsActive] ON [Roles] ([IsActive])`);

        // ─── 2. Permissions ────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [Permissions] (
                [Id]          INT IDENTITY(1,1) PRIMARY KEY,
                [Code]        VARCHAR(50)   NOT NULL UNIQUE,
                [Name]        NVARCHAR(100) NULL,
                [Description] NVARCHAR(MAX) NULL,
                [CreatedAt]   DATETIME      NOT NULL DEFAULT GETDATE()
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX [IX_Permissions_Code] ON [Permissions] ([Code])`);

        // ─── 3. Users ──────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [Users] (
                [Id]           INT IDENTITY(1,1) PRIMARY KEY,
                [Username]     NVARCHAR(100) NOT NULL UNIQUE,
                [PasswordHash] NVARCHAR(255) NOT NULL,
                [FullName]     NVARCHAR(150) NOT NULL,
                [Email]        NVARCHAR(150) NULL,
                [RoleId]       INT           NOT NULL,
                [IsActive]     BIT           NOT NULL DEFAULT 1,
                [CreatedAt]    DATETIME      NOT NULL DEFAULT GETDATE(),
                CONSTRAINT [FK_Users_Roles] FOREIGN KEY ([RoleId]) REFERENCES [Roles]([Id])
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username])`);
        await queryRunner.query(`CREATE UNIQUE INDEX [IX_Users_Email]    ON [Users] ([Email])`);
        await queryRunner.query(`CREATE INDEX        [IX_Users_RoleId]   ON [Users] ([RoleId])`);
        await queryRunner.query(`CREATE INDEX        [IX_Users_IsActive] ON [Users] ([IsActive])`);

        // ─── 4. Documents ──────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [Documents] (
                [Id]           INT IDENTITY(1,1) PRIMARY KEY,
                [DocumentCode] NVARCHAR(50)   NOT NULL,
                [Title]        NVARCHAR(255)  NOT NULL,
                [Description]  NVARCHAR(1000) NULL,
                [Status]       NVARCHAR(50)   NOT NULL DEFAULT 'DRAFT',
                [CreatedBy]    INT            NOT NULL,
                [AssignedTo]   INT            NULL,
                [CreatedAt]    DATETIME       NOT NULL DEFAULT GETDATE(),
                [UpdatedAt]    DATETIME       NOT NULL DEFAULT GETDATE(),
                CONSTRAINT [FK_Documents_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [Users]([Id]),
                CONSTRAINT [FK_Documents_AssignedTo] FOREIGN KEY ([AssignedTo]) REFERENCES [Users]([Id]) ON DELETE SET NULL
            )
        `);
        await queryRunner.query(`CREATE INDEX [IX_Documents_Status] ON [Documents] ([Status])`);

        // ─── 5. DocumentFiles ─────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [DocumentFiles] (
                [Id]         INT IDENTITY(1,1) PRIMARY KEY,
                [DocumentId] INT           NULL,
                [FileName]   NVARCHAR(255) NOT NULL,
                [FilePath]   NVARCHAR(500) NOT NULL,
                [FileSize]   BIGINT        NOT NULL,
                [FileType]   NVARCHAR(100) NOT NULL,
                [UploadedBy] INT           NOT NULL,
                [CreatedAt]  DATETIME      NOT NULL DEFAULT GETDATE(),
                CONSTRAINT [FK_DocumentFiles_Documents] FOREIGN KEY ([DocumentId]) REFERENCES [Documents]([Id]) ON DELETE CASCADE,
                CONSTRAINT [FK_DocumentFiles_Users]     FOREIGN KEY ([UploadedBy]) REFERENCES [Users]([Id])
            )
        `);
        await queryRunner.query(`CREATE INDEX [IX_DocumentFiles_DocumentId] ON [DocumentFiles] ([DocumentId])`);

        // ─── 6. RolePermissions ───────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [RolePermissions] (
                [Id]           INT IDENTITY(1,1) PRIMARY KEY,
                [RoleId]       INT       NOT NULL,
                [PermissionId] INT       NOT NULL,
                [IsEnabled]    BIT       NOT NULL DEFAULT 1,
                [CreatedAt]    DATETIME2 NOT NULL DEFAULT GETDATE(),
                CONSTRAINT [FK_RolePermissions_Roles]       FOREIGN KEY ([RoleId])       REFERENCES [Roles]([Id]),
                CONSTRAINT [FK_RolePermissions_Permissions] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions]([Id])
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX [IX_RolePermissions_RoleId_PermissionId] ON [RolePermissions] ([RoleId], [PermissionId])`);
        await queryRunner.query(`CREATE INDEX        [IX_RolePermissions_RoleId]              ON [RolePermissions] ([RoleId])`);

        // ─── 7. DocumentWorkflowRules ─────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [DocumentWorkflowRules] (
                [Id]            INT IDENTITY(1,1) PRIMARY KEY,
                [CurrentStatus] NVARCHAR(50)  NOT NULL,
                [Action]        NVARCHAR(50)  NOT NULL,
                [NextStatus]    NVARCHAR(50)  NOT NULL,
                [Description]   NVARCHAR(255) NULL,
                [RoleCode]      NVARCHAR(50)  NULL,
                CONSTRAINT [FK_WorkflowRules_Roles] FOREIGN KEY ([RoleCode]) REFERENCES [Roles]([Code])
            )
        `);
        await queryRunner.query(`CREATE INDEX [IX_WorkflowRules_Transition] ON [DocumentWorkflowRules] ([CurrentStatus], [Action])`);

        // ─── 8. DocumentHistories ─────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE [DocumentHistories] (
                [Id]          INT IDENTITY(1,1) PRIMARY KEY,
                [DocumentId]  INT          NOT NULL,
                [Note]        NVARCHAR(MAX) NULL,
                [Action]      NVARCHAR(MAX) NOT NULL,
                [StatusAfter] NVARCHAR(MAX) NOT NULL,
                [FromUserId]  INT           NULL,
                [ToUserId]    INT           NULL,
                [CreatedAt]   DATETIME      NOT NULL DEFAULT GETDATE(),
                CONSTRAINT [FK_DocumentHistories_Documents]  FOREIGN KEY ([DocumentId]) REFERENCES [Documents]([Id]) ON DELETE CASCADE,
                CONSTRAINT [FK_DocumentHistories_FromUser]   FOREIGN KEY ([FromUserId]) REFERENCES [Users]([Id]),
                CONSTRAINT [FK_DocumentHistories_ToUser]     FOREIGN KEY ([ToUserId])   REFERENCES [Users]([Id])
            )
        `);
        await queryRunner.query(`CREATE INDEX [IX_DocumentHistories_DocumentId]           ON [DocumentHistories] ([DocumentId])`);
        await queryRunner.query(`CREATE INDEX [IX_DocumentHistories_FromUserId]           ON [DocumentHistories] ([FromUserId])`);
        await queryRunner.query(`CREATE INDEX [IX_DocumentHistories_DocumentId_CreatedAt] ON [DocumentHistories] ([DocumentId], [CreatedAt])`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop theo thứ tự ngược lại (child tables trước)
        await queryRunner.query(`DROP TABLE IF EXISTS [DocumentHistories]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [DocumentWorkflowRules]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [RolePermissions]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [DocumentFiles]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [Documents]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [Users]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [Permissions]`);
        await queryRunner.query(`DROP TABLE IF EXISTS [Roles]`);
    }

}
