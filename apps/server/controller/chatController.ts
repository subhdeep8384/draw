import {prisma } from "@repo/db/prisma";
import type { Request, Response } from "express";



export async function chatController(req: Request, res: Response) {
    console.log("inside chats controller")
    try {
        const roomId = req.params.roomId as string;
        if (!roomId) return res.status(400).json({ success: false, error: "roomId is required" });
        const beforeId = req.query.beforeId as string | undefined;
        const limit = parseInt(req.query.limit as string) || 20;

        const queryOptions: any = {
            where: { roomId },
            include: { user: true, room: true },
            orderBy: { createdAt: "desc" },
            take: limit,
        };

        if (beforeId) {
            queryOptions.cursor = { id: beforeId };
            queryOptions.skip = 1; 
        }

        const chats = await prisma.chat.findMany(queryOptions);

        const orderedChats = chats.reverse();

        res.json({
            success: true,
            chats: orderedChats,
            nextCursor: orderedChats.length > 0 ? orderedChats : null,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch chats" });
    }
}