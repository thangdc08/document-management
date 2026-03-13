import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsTable1773389743884 implements MigrationInterface {
    name = 'AddCommentsTable1773389743884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Comments" ("Id" int NOT NULL IDENTITY(1,1), "Content" nvarchar(1000) NOT NULL, "DocumentId" int NOT NULL, "UserId" int, "CreatedAt" datetime2 NOT NULL CONSTRAINT "DF_b0670084cd941da6aa6e0b4edcd" DEFAULT getdate(), CONSTRAINT "PK_22d4c8fb14603c9ad0b4e986e25" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IX_Comments_UserId" ON "Comments" ("UserId") `);
        await queryRunner.query(`CREATE INDEX "IX_Comments_DocumentId" ON "Comments" ("DocumentId") `);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_429b2c881da53eb62c4ea5f4436" FOREIGN KEY ("DocumentId") REFERENCES "Documents"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aec877302044dad89b9934d756d" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aec877302044dad89b9934d756d"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_429b2c881da53eb62c4ea5f4436"`);
        await queryRunner.query(`DROP INDEX "IX_Comments_DocumentId" ON "Comments"`);
        await queryRunner.query(`DROP INDEX "IX_Comments_UserId" ON "Comments"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
    }

}
