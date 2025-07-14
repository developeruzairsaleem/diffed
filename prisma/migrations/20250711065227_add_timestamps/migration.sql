/*
  Warnings:

  - You are about to drop the column `createdAt` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `workplaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_gameId_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "createdAt",
DROP COLUMN "gameId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "workplaces";
