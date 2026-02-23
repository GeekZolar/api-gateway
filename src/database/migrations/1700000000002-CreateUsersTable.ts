import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000000002 implements MigrationInterface {
  name = 'CreateUsersTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "username" character varying(50) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "role_id" uuid NOT NULL,
        "is_active" boolean NOT NULL DEFAULT false,
        "is_approved" boolean NOT NULL DEFAULT false,
        "mfa_enabled" boolean NOT NULL DEFAULT false,
        "mfa_secret" character varying(255),
        "last_login_date" TIMESTAMP,
        "password_last_changed_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "failed_login_attempts" integer NOT NULL DEFAULT 0,
        "account_locked_until" TIMESTAMP,
        "created_by" uuid,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "approved_by" uuid,
        "approved_date" TIMESTAMP,
        "updated_by" uuid,
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("user_id"),
        CONSTRAINT "FK_users_role" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id"),
        CONSTRAINT "FK_users_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("user_id"),
        CONSTRAINT "FK_users_approved_by" FOREIGN KEY ("approved_by") REFERENCES "users"("user_id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "idx_users_username" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "idx_users_role_id" ON "users" ("role_id")`);
    await queryRunner.query(`CREATE INDEX "idx_users_is_active" ON "users" ("is_active")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_users_is_active"`);
    await queryRunner.query(`DROP INDEX "idx_users_role_id"`);
    await queryRunner.query(`DROP INDEX "idx_users_username"`);
    await queryRunner.query(`DROP INDEX "idx_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
