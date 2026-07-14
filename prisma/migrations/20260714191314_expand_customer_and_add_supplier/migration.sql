-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "area" TEXT,
ADD COLUMN     "creditLimit" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "lastVisitDate" TIMESTAMP(3),
ADD COLUMN     "nameTamil" TEXT,
ADD COLUMN     "rewardPoints" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "contactDetails" TEXT,
    "gstin" TEXT,
    "openingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplierCode_key" ON "Supplier"("supplierCode");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_phone_idx" ON "Supplier"("phone");

-- CreateIndex
CREATE INDEX "Supplier_gstin_idx" ON "Supplier"("gstin");

-- CreateIndex
CREATE INDEX "Supplier_balance_idx" ON "Supplier"("balance");

-- CreateIndex
CREATE INDEX "Customer_area_idx" ON "Customer"("area");

-- CreateIndex
CREATE INDEX "Customer_balance_idx" ON "Customer"("balance");

-- CreateIndex
CREATE INDEX "Customer_lastVisitDate_idx" ON "Customer"("lastVisitDate");
