import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1761479949632 implements MigrationInterface {
    name = 'CreateUserTable1761479949632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "username" character varying, "password" character varying NOT NULL, "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{BUYER}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
