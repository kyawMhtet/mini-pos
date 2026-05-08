import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const result: Record<string, unknown> = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
    },
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email: "phyo@gmail.com" },
      select: { id: true, email: true, name: true, password: true },
    });
    result.userFound = !!user;
    result.hasPassword = !!user?.password;
    if (user?.password) {
      result.passwordMatch = await bcrypt.compare("MiniPOS2026!", user.password);
    }
    result.dbOk = true;
  } catch (err) {
    result.dbOk = false;
    result.dbError = err instanceof Error ? err.message : String(err);
  }

  return Response.json(result);
}
