/*
  Warnings:

  - You are about to drop the column `coordinates` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "coordinates" TEXT NOT NULL DEFAULT '0,0';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coordinates",
ADD COLUMN     "telephone" TEXT NOT NULL DEFAULT '';
