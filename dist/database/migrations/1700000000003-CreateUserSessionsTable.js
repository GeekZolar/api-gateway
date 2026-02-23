"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSessionsTable1700000000003 = void 0;
class CreateUserSessionsTable1700000000003 {
    constructor() {
        this.name = 'CreateUserSessionsTable1700000000003';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "user_sessions" (
        "session_id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "refresh_token_hash" character varying(255) NOT NULL,
        "ip_address" character varying(45),
        "user_agent" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "expires_at" TIMESTAMP NOT NULL,
        "last_activity" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_user_sessions" PRIMARY KEY ("session_id"),
        CONSTRAINT "FK_user_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_sessions_user_id" ON "user_sessions" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "idx_sessions_refresh_token" ON "user_sessions" ("refresh_token_hash")`);
        await queryRunner.query(`CREATE INDEX "idx_sessions_expires_at" ON "user_sessions" ("expires_at")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_sessions_expires_at"`);
        await queryRunner.query(`DROP INDEX "idx_sessions_refresh_token"`);
        await queryRunner.query(`DROP INDEX "idx_sessions_user_id"`);
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }
}
exports.CreateUserSessionsTable1700000000003 = CreateUserSessionsTable1700000000003;
//# sourceMappingURL=1700000000003-CreateUserSessionsTable.js.map