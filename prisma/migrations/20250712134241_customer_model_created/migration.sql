-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('casual', 'competitive', 'professional', 'collector');

-- CreateEnum
CREATE TYPE "GamingLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('low', 'medium', 'high', 'premium');

-- CreateEnum
CREATE TYPE "ActivityPattern" AS ENUM ('weekend_warrior', 'daily_grinder', 'casual_player', 'seasonal_player');

-- CreateEnum
CREATE TYPE "LearningStyle" AS ENUM ('visual', 'hands_on', 'analytical', 'social');

-- CreateEnum
CREATE TYPE "CommunicationPreference" AS ENUM ('text_only', 'voice_chat', 'video_call', 'mixed');

-- CreateEnum
CREATE TYPE "RiskTolerance" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerType" "CustomerType" NOT NULL,
    "gamingLevel" "GamingLevel" NOT NULL,
    "primaryGames" JSONB NOT NULL,
    "currentRanks" JSONB,
    "gamingGoals" JSONB,
    "budgetRange" "BudgetRange" NOT NULL DEFAULT 'medium',
    "preferredServiceTypes" JSONB,
    "activityPattern" "ActivityPattern" NOT NULL DEFAULT 'casual_player',
    "learningStyle" "LearningStyle" NOT NULL DEFAULT 'hands_on',
    "communicationPreference" "CommunicationPreference" NOT NULL DEFAULT 'mixed',
    "peakHours" JSONB,
    "riskTolerance" "RiskTolerance" NOT NULL DEFAULT 'medium',
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lifetimeValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "satisfactionScore" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "churnRiskScore" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "lastOrderDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_userId_key" ON "customers"("userId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
