/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "imgUrl",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'https://diffed.gg/images/Maskgroup.png';
