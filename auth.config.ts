import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      credentials: {},
      authorize: async () => null,
    }),
  ],

  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;