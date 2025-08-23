/*
  Warnings:

  - Added the required column `gamesCount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teammatesCount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Subpackage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('stripe', 'paypal');

-- CreateEnum
CREATE TYPE "SubpackageType" AS ENUM ('pergame', 'perteammate');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gamesCount" INTEGER NOT NULL,
ADD COLUMN     "packageType" "SubpackageType" NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'stripe',
ADD COLUMN     "paypal_order_id" TEXT,
ADD COLUMN     "rank" JSONB,
ADD COLUMN     "teammatesCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subpackage" ADD COLUMN     "ranks" JSONB,
ADD COLUMN     "type" "SubpackageType" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'stripe',
ADD COLUMN     "paypal_capture_id" TEXT,
ADD COLUMN     "paypal_order_id" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateIndex
CREATE INDEX "idx_transactions_payment_method" ON "Transaction"("paymentMethod");
