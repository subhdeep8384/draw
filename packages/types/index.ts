import {auth } from "@repo/auth/betterAuth"
import {prisma} from "@repo/db/prisma"


import {z} from "zod"

export const userSignUpSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string()
})

export const userLoginSchema = z.object({
    email : z.string().email(),
    password : z.string()
})

export const roomSchema = z.object({
    name : z.string().min(3).max(20),
    description : z.string().min(3).max(200),
})