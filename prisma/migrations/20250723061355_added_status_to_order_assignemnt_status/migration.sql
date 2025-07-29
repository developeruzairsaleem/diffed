-- CreateEnum
CREATE TYPE "OrderAssignmentStatus" AS ENUM ('REPLACED', 'PENDING', 'APPROVED', 'COMPLETED', 'VERIFIED');

-- AlterTable
ALTER TABLE "OrderAssignment" ADD COLUMN     "status" "OrderAssignmentStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ActivityPattern";

-- DropEnum
DROP TYPE "Availability";

-- DropEnum
DROP TYPE "BudgetRange";

-- DropEnum
DROP TYPE "CommunicationPreference";

-- DropEnum
DROP TYPE "CustomerType";

-- DropEnum
DROP TYPE "GamingLevel";

-- DropEnum
DROP TYPE "LearningStyle";

-- DropEnum
DROP TYPE "ProviderType";

-- DropEnum
DROP TYPE "RiskTolerance";

-- DropEnum
DROP TYPE "VerificationStatus";
