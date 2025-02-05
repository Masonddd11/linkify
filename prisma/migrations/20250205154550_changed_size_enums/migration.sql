/*
  Warnings:

  - The values [SMALL,MEDIUM,LARGE,EXTRA_LARGE] on the enum `WIDGET_SIZE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WIDGET_SIZE_new" AS ENUM ('SMALL_SQUARE', 'LARGE_SQUARE', 'WIDE', 'LONG');
ALTER TABLE "Widget" ALTER COLUMN "size" TYPE "WIDGET_SIZE_new" USING ("size"::text::"WIDGET_SIZE_new");
ALTER TYPE "WIDGET_SIZE" RENAME TO "WIDGET_SIZE_old";
ALTER TYPE "WIDGET_SIZE_new" RENAME TO "WIDGET_SIZE";
DROP TYPE "WIDGET_SIZE_old";
COMMIT;
