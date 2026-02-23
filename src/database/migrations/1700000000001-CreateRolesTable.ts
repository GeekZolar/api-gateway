import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1700000000001 implements MigrationInterface {
  name = 'CreateRolesTable1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_roles_name"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
