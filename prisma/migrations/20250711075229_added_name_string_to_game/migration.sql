/*
  Warnings:

  - Added the required column `name` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "name" TEXT NOT NULL;
