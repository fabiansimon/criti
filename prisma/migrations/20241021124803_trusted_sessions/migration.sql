/*
  Warnings:

  - You are about to drop the column `trustedSessions` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "trustedSessions";

-- CreateTable
CREATE TABLE "TrustedSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "TrustedSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrustedSession" ADD CONSTRAINT "TrustedSession_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
