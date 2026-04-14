import { prisma } from "@repo/db/prisma"

import type { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcrypt"

const joinRoomSchema = z.object({
    name: z.string().min(3).max(30),
    password: z.string().min(3).max(30)
})

export const joinRoom = async (req: Request, res: Response) => {
    try{

        const body = joinRoomSchema.safeParse(req.body);
        if (body.error) {
            return res.status(400).json({
                message: "wrong name or password"
            })
        }
        const { name, password } = body.data;
        const roomFound = await prisma.room.findFirst({
            where: {
                name,
            },
        })
        if(!roomFound ){
            return res.status(400).json({
                message : "Not found room"
            })
        }
        
        const isMatch = await bcrypt.compare(password, roomFound.password!);
        
        if(!isMatch){
            return res.status(400).json({
                message :"password wrong"
            })
        }
        return res.status(200).json({
            message: "joined successfully",
            roomId: roomFound.id,
            room: roomFound,
        });
    }catch(_){
        console.log(_)
    }
        
}