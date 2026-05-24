import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import { UAParser } from "ua-parser-js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
async authorize(credentials, request) {
  const parsed = loginSchema.safeParse(credentials);
  const attemptEmail = (credentials?.email as string) || "Unknown";

  const userAgent = request?.headers?.get("user-agent");
  const ipAddress = request?.headers?.get("x-forwarded-for") || null;
  
  let browser = "Unknown";
  let os = "Unknown";
  let device = "desktop";

  if (userAgent) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    browser = result.browser.name || "Unknown";
    os = result.os.name || "Unknown";
    device = result.device.type || "desktop";
  }

  const logAttempt = async (success: boolean, email: string) => {
    try {
      await prisma.loginAttempt.create({
        data: {
          email,
          success,
          ipAddress,
          browser,
          os,
          device,
        }
      });
    } catch (e) {
      console.error("Failed to log attempt:", e);
    }
  };

  if (!parsed.success) {
    await logAttempt(false, attemptEmail);
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  if (!user?.password) {
    await logAttempt(false, parsed.data.email);
    return null;
  }

  const valid = await bcrypt.compare(
    parsed.data.password,
    user.password
  );

  if (!valid) {
    await logAttempt(false, parsed.data.email);
    return null;
  }

  await logAttempt(true, parsed.data.email);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});
