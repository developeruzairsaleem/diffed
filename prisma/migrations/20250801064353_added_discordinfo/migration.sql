/*
  Warnings:

  - Added the required column `discordTag` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordUsername` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discordTag" TEXT NOT NULL,
ADD COLUMN     "discordUsername" TEXT NOT NULL,
ADD COLUMN     "isInQueue" BOOLEAN NOT NULL DEFAULT false;
