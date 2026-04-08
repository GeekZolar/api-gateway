"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreatePasswordResetAndHistoryTables1700000000005", {
    enumerable: true,
    get: function() {
        return CreatePasswordResetAndHistoryTables1700000000005;
    }
});
let CreatePasswordResetAndHistoryTables1700000000005 = class CreatePasswordResetAndHistoryTables1700000000005 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "token_id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "token_hash" character varying(255) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "is_used" boolean NOT NULL DEFAULT false,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_password_reset_tokens" PRIMARY KEY ("token_id"),
        CONSTRAINT "FK_password_reset_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_reset_token_hash" ON "password_reset_tokens" ("token_hash")`);
        await queryRunner.query(`CREATE INDEX "idx_reset_user_id" ON "password_reset_tokens" ("user_id")`);
        await queryRunner.query(`
      CREATE TABLE "password_history" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_password_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_password_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_password_history_user_id" ON "password_history" ("user_id")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_password_history_user_id"`);
        await queryRunner.query(`DROP TABLE "password_history"`);
        await queryRunner.query(`DROP INDEX "idx_reset_user_id"`);
        await queryRunner.query(`DROP INDEX "idx_reset_token_hash"`);
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    }
    constructor(){
        this.name = 'CreatePasswordResetAndHistoryTables1700000000005';
    }
};

//# sourceMappingURL=1700000000005-CreatePasswordResetAndHistoryTables.js.map