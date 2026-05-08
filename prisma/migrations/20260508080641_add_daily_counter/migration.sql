-- CreateTable
CREATE TABLE "DailyCounter" (
    "date" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyCounter_pkey" PRIMARY KEY ("date")
);
