import type { Request, Response } from "express";
import { prisma } from "@repo/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt"

const roomSchema = z.object({
    name: z.string().min(3).max(20),
    password : z.string().min(6).max(30).optional()
})

interface request extends Request {
    session?: {
        user: any
    }
}
export async function roomCreate(req: request, res: Response) {
    const user = req?.session?.user;
    const body = roomSchema.safeParse(req.body);
    if (body.success === false) {
        res.status(400).json({ error: body.error })
        return;
    }
    const { name , password  } = body.data;
    let hashedPassword = password;
    if(password){
        hashedPassword = await bcrypt.hash(password, 10)
    }
    try {
      
        const room = await prisma.room.create({
            data: {
                name: name,
                password : hashedPassword , 
                adminId : user.id
            },
        });
        if (!room) {
            res.status(400).json({ error: "something wrong" })
            return;
        }
        res.status(200).json({
            message: "success",
            "room": room
        })
        
    } catch (_) {
        res.status(400).json({ error: _ })
    } finally {

    }
}