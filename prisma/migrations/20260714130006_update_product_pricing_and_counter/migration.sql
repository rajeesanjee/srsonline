/*
  Warnings:

  - You are about to drop the column `costPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "costPrice",
DROP COLUMN "location",
ADD COLUMN     "cardProfitPercent" DECIMAL(8,2),
ADD COLUMN     "counter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wholesaleProfitPercent" DECIMAL(8,2),
ALTER COLUMN "price" SET DEFAULT 0;
