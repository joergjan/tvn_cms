/*
  Warnings:

  - You are about to drop the column `riegeId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_riegeId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "riegeId";

-- CreateTable
CREATE TABLE "ImageRiege" (
    "imageId" INTEGER NOT NULL,
    "riegeId" INTEGER NOT NULL,

    CONSTRAINT "ImageRiege_pkey" PRIMARY KEY ("imageId","riegeId")
);

-- AddForeignKey
ALTER TABLE "ImageRiege" ADD CONSTRAINT "ImageRiege_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageRiege" ADD CONSTRAINT "ImageRiege_riegeId_fkey" FOREIGN KEY ("riegeId") REFERENCES "Riege"("id") ON DELETE CASCADE ON UPDATE CASCADE;
