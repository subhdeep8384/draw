import {prisma} from "@repo/db/prisma"    
import { response, type Request, type Response } from "express";


interface request extends Request {
    session?: {
        user: any
    }
}   
export async function getRooms(req : Request  , res : Response){
    const user = req?.session?.user;
    const data = await prisma.room.findMany({
        where:{
            adminId : user.id
        },
        include:{
            users : true
        } 

    })
    res.status(200).json(data)
}