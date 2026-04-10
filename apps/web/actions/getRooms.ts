import {prisma} from "@repo/db/prisma"

export  async function getRooms(id : string){
    const res = await prisma.room.findMany({
        where:{
            adminId : id
        }
    })
    
    return res
}