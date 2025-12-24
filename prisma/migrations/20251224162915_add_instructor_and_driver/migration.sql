-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DRIVER', 'INSTRUCTOR');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "coordinates" TEXT NOT NULL DEFAULT '0,0',
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'DRIVER',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Instructor" (
    "id" SERIAL NOT NULL,
    "priceHour" DECIMAL(65,30) NOT NULL,
    "bio" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseCategory" (
    "id" SERIAL NOT NULL,
    "acronym" "Category" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "LicenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructorCategory" (
    "id" SERIAL NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "InstructorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "Instructor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseCategory_acronym_key" ON "LicenseCategory"("acronym");

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_targetCategoryId_fkey" FOREIGN KEY ("targetCategoryId") REFERENCES "LicenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorCategory" ADD CONSTRAINT "InstructorCategory_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorCategory" ADD CONSTRAINT "InstructorCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LicenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
