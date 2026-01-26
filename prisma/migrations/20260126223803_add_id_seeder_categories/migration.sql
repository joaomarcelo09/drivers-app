/*
  Warnings:

  - A unique constraint covering the columns `[id_seeder]` on the table `LicenseCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_seeder` to the `LicenseCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LicenseCategory" ADD COLUMN     "id_seeder" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LicenseCategory_id_seeder_key" ON "LicenseCategory"("id_seeder");
