import { betterAuth } from "better-auth";
import { prisma } from "@repo/db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
console.log(process.env.BETTER_AUTH_FRONTEND_URL)
export const auth = betterAuth({
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BETTER_AUTH_FRONTEND_URL!,
  ],

  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,

  advanced: {
    useSecureCookies: true,

    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },
});