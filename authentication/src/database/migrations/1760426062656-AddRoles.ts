import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1760426062656 implements MigrationInterface {
  name = 'AddRoles1760426062656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "IsAdmin" TO "roles"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_enum" AS ENUM('BUYER', 'SELLER', 'ADMIN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{BUYER}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "roles" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "roles" TO "IsAdmin"`,
    );
  }
}
