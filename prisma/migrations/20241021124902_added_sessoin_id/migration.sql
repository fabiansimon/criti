/*
  Warnings:

  - Added the required column `sessionId` to the `TrustedSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrustedSession" ADD COLUMN     "sessionId" TEXT NOT NULL;
