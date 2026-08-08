import { betterAuth } from "better-auth";
import { prisma } from "@repo/db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
console.log(process.env.BETTER_AUTH_FRONTEND_URL)
export const auth = betterAuth({
  trustedOrigins: [
    process.env.BETTER_AUTH_FRONTEND_URL!,
  ],

  baseURL: process.env.BETTER_AUTH_URL!,

  advanced: {
    useSecureCookies: true,

     crossSubDomainCookies: {
      enabled: true,
      domain: ".subhdeep.icu",
    },

    defaultCookieAttributes: {
      domain: ".subhdeep.icu",
      sameSite: "none",
      httpOnly: true,
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