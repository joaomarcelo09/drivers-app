/*
  Warnings:

  - You are about to drop the column `targetCategoryId` on the `Driver` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_targetCategoryId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "targetCategoryId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
