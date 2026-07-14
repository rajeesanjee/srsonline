-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'GPAY';

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "gpayAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;
