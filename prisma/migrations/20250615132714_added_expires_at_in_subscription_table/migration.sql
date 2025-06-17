/*
  Warnings:

  - Added the required column `expiresAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
