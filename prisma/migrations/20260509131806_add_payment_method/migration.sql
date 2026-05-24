-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('KPAY', 'KBZ_BANKING', 'AYA_BANKING', 'WAVE_MONEY', 'CASH');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH';
