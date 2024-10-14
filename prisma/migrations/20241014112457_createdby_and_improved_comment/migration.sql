/*
  Warnings:

  - Added the required column `byAdmin` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "byAdmin" BOOLEAN NOT NULL,
ADD COLUMN     "open" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
