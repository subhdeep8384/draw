import {betterAuth} from "better-auth"
import {prisma} from "@repo/db/prisma"
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:3000"],
    database : prismaAdapter(prisma ,{
        provider: "postgresql"
    }),
    emailAndPassword :{
        enabled: true,
    },
    baseURL: "http://localhost:3005",
})