import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnquiryTable1759572678812 implements MigrationInterface {
  name = 'CreateEnquiryTable1759572678812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."enquiry_status_enum" AS ENUM('in-progress', 'completed', 'cancelled')
        `);
    await queryRunner.query(`
            CREATE TABLE "enquiry" (
                "enquiry_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "property_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "message" text,
                "status" "public"."enquiry_status_enum" NOT NULL DEFAULT 'in-progress',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f49f8bb00b54c0ade8f8042172c" PRIMARY KEY ("enquiry_id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "enquiry"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."enquiry_status_enum"
        `);
  }
}
