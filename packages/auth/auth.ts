import { betterAuth } from "better-auth";
import { prisma } from "@repo/db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
console.log(process.env.BETTER_AUTH_FRONTEND_URL)
export const auth = betterAuth({
    trustedOrigins: [
        process.env.BETTER_AUTH_FRONTEND_URL!,
    ],

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    baseURL: process.env.BETTER_AUTH_BASE_URL!,
});