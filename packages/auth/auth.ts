import {betterAuth} from "better-auth"
import {prisma} from "@repo/db/prisma"
import { prismaAdapter } from "better-auth/adapters/prisma";


export const auth = betterAuth({
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    database : prismaAdapter(prisma ,{
        provider: "postgresql"
    }),
    emailAndPassword :{
        enabled: true,
    },
    baseURL: process.env.BETTER_AUTH_URL!,
})