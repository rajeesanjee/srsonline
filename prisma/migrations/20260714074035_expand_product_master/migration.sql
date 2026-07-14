/*
  Warnings:

  - You are about to alter the column `stock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(12,3)`.
  - A unique constraint covering the columns `[productCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "allowDecimal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "creditPrice" DECIMAL(10,2),
ADD COLUMN     "discountPercent" DECIMAL(8,2),
ADD COLUMN     "gstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "hsnCode" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "mrp" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "nameTamil" TEXT,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "profitPercent" DECIMAL(8,2),
ADD COLUMN     "purchasePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "supplierName" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'PCS',
ADD COLUMN     "wholesalePrice" DECIMAL(10,2),
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "stock" SET DATA TYPE DECIMAL(12,3);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productCode_key" ON "Product"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");
