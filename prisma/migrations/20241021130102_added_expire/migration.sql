-- AlterTable
ALTER TABLE "TrustedSession" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;