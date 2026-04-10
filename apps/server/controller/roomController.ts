import type { Request, Response } from "express";
import { prisma } from "@repo/db/prisma";
import { z } from "zod";

const roomSchema = z.object({
    name: z.string().min(3).max(20)
})

interface request extends Request {
    session?: {
        user: any
    }
}
export async function roomCreate(req: request, res: Response) {
    const user = req?.session?.user;
    console.log("user is " , user)
    const body = roomSchema.safeParse(req.body);
    if (body.success === false) {
        res.status(400).json({ error: body.error })
        return;
    }
    const { name } = body.data;
    try {

        const room = await prisma.room.create({
            data: {
                name: name,
                adminId : user.id
            }
        });
        console.log("room is " , room)
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