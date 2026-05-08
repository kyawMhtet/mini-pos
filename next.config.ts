import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's generated client (custom output path) isn't traced automatically by Next.js.
  // This ensures the WASM engine and all generated files are included in the Vercel bundle.
  outputFileTracingIncludes: {
    "/**": ["./app/generated/prisma/**/*"],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
