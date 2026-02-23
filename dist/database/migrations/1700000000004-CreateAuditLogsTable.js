"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuditLogsTable1700000000004 = void 0;
class CreateAuditLogsTable1700000000004 {
    constructor() {
        this.name = 'CreateAuditLogsTable1700000000004';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "audit_id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid,
        "action" character varying(100) NOT NULL,
        "entity_type" character varying(50) NOT NULL,
        "entity_id" uuid,
        "old_values" jsonb,
        "new_values" jsonb,
        "ip_address" character varying(45),
        "user_agent" text,
        "status" character varying(20) NOT NULL,
        "error_message" text,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("audit_id"),
        CONSTRAINT "FK_audit_logs_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id")
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_audit_user_id" ON "audit_logs" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_action" ON "audit_logs" ("action")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_entity_type" ON "audit_logs" ("entity_type")`);
        await queryRunner.query(`CREATE INDEX "idx_audit_created_date" ON "audit_logs" ("created_date" DESC)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_audit_created_date"`);
        await queryRunner.query(`DROP INDEX "idx_audit_entity_type"`);
        await queryRunner.query(`DROP INDEX "idx_audit_action"`);
        await queryRunner.query(`DROP INDEX "idx_audit_user_id"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }
}
exports.CreateAuditLogsTable1700000000004 = CreateAuditLogsTable1700000000004;
//# sourceMappingURL=1700000000004-CreateAuditLogsTable.js.map