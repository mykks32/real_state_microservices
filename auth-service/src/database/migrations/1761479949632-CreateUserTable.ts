import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1761479949632 implements MigrationInterface {
  name = 'CreateUserTable1761479949632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create enum type first
    await queryRunner.query(`
            CREATE TYPE "public"."user_roles_enum" AS ENUM('BUYER', 'ADMIN', 'SELLER')
        `);

    // 2. Then create the user table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying,
                "username" character varying,
                "password" character varying NOT NULL,
                "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{BUYER}',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lastLoginAt" TIMESTAMP,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table first
    await queryRunner.query(`DROP TABLE "user"`);

    // Then drop enum type
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
  }
}
