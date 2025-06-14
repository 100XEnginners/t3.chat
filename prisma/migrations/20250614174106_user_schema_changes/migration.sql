-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about" TEXT,
ADD COLUMN     "customTraits" TEXT[],
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "plan" "Plan" DEFAULT 'FREE',
ADD COLUMN     "planCreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "planUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "whatDoYouDo" TEXT;
