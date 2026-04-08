"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRolesTable1700000000001 = void 0;
class CreateRolesTable1700000000001 {
    constructor() {
        this.name = 'CreateRolesTable1700000000001';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "roles" (
        "role_id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "role_name" character varying(100) NOT NULL,
        "description" text,
        "permissions" jsonb NOT NULL,
        "is_system_role" boolean NOT NULL DEFAULT false,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_role_name" UNIQUE ("role_name"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("role_id")
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_roles_name" ON "roles" ("role_name")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_roles_name"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }
}
exports.CreateRolesTable1700000000001 = CreateRolesTable1700000000001;
//# sourceMappingURL=1700000000001-CreateRolesTable.js.map