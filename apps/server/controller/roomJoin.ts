import type { Request, Response } from "express";
import {z} from "zod";

const roomJoinSchema = z.object({
    roomId : z.string() 
})

export function roomJoin(req : Request , res : Response){
    const body = roomJoinSchema.safeParse(req.body);
    if(body.success === false){
        res.status(400).json({ error : body.error })
        return ;
    }
    const user = req.session.user ;
    const { roomId } = body.data ;

    
}