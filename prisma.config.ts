import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Use direct (non-pooling) URL for migrations to bypass PgBouncer transaction mode limitations
  datasource: {
    url: process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_PRISMA_URL ?? "",
  },
});
