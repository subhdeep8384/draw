import {prisma } from "@repo/db/prisma"
import type { Request, Response } from "express";
export async function deleteRoom(req :Request , res : Response ){
    const roomId = req.params.roomId ;

    const deletedRoom =await prisma.room.delete({
        where:{
            id : roomId as string,
            adminId : req.session.user.id
        }
    })
    console.log(deletedRoom)
    res.json({
        status : 200,
        message : "Room deleted successfully",
        deletedRoom : deletedRoom
    })
}