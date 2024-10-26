-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_creatorId_fkey";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
