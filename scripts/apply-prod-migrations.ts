/**
 * One-off: applies missing production migrations to Neon DB
 * Usage: DATABASE_URL="..." npx tsx scripts/apply-prod-migrations.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sqls: [string, string][] = [
    ["DailyCounter table", `CREATE TABLE IF NOT EXISTS "DailyCounter" ("date" TEXT NOT NULL, "value" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "DailyCounter_pkey" PRIMARY KEY ("date"))`],
    ["Product.size", `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "size" TEXT`],
    ["Product.buyingPrice", `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "buyingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0`],
    ["PaymentMethod enum", `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentMethod') THEN CREATE TYPE "PaymentMethod" AS ENUM ('KPAY', 'KBZ_BANKING', 'AYA_BANKING', 'WAVE_MONEY', 'CASH'); END IF; END $$`],
    ["Order.paymentMethod", `ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH'`],
  ];

  for (const [label, sql] of sqls) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`✓ ${label}`);
    } catch (e: any) {
      console.error(`✗ ${label}:`, e.message);
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
