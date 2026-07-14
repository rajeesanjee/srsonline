-- CreateEnum
CREATE TYPE "SalePriceMode" AS ENUM ('WHOLESALE', 'RETAIL', 'CARD');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('OPEN', 'HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CARD', 'CREDIT', 'MIXED', 'OTHER');

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "billNumber" TEXT NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerCode" TEXT,
    "customerName" TEXT NOT NULL DEFAULT 'CASH',
    "priceMode" "SalePriceMode" NOT NULL DEFAULT 'RETAIL',
    "itemCount" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gstTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "roundOff" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentType" "PaymentType" NOT NULL DEFAULT 'CASH',
    "cashAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cardAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "creditAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "otherAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "SaleStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT,
    "productCode" TEXT,
    "barcode" TEXT,
    "productName" TEXT NOT NULL,
    "productNameTamil" TEXT,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "quantity" DECIMAL(12,3) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "rate" DECIMAL(10,2) NOT NULL,
    "gstRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "gstAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountPercent" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_billNumber_key" ON "Sale"("billNumber");

-- CreateIndex
CREATE INDEX "Sale_billDate_idx" ON "Sale"("billDate");

-- CreateIndex
CREATE INDEX "Sale_customerName_idx" ON "Sale"("customerName");

-- CreateIndex
CREATE INDEX "Sale_status_idx" ON "Sale"("status");

-- CreateIndex
CREATE INDEX "SaleItem_saleId_idx" ON "SaleItem"("saleId");

-- CreateIndex
CREATE INDEX "SaleItem_productId_idx" ON "SaleItem"("productId");

-- CreateIndex
CREATE INDEX "SaleItem_productCode_idx" ON "SaleItem"("productCode");

-- CreateIndex
CREATE INDEX "SaleItem_counter_idx" ON "SaleItem"("counter");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
