/*
  Warnings:

  - You are about to alter the column `priceHour` on the `Instructor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Instructor" ALTER COLUMN "priceHour" SET DATA TYPE DOUBLE PRECISION;
